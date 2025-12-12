import { NuxtAuthHandler } from "#auth";

// Type definitions for better type safety
interface AuthUser {
  id: string;
  email: string;
  name: string;
  role: string;
  organization: string;
}

const runtimeConfig = useRuntimeConfig();
const secret = runtimeConfig.authJs?.secret;
const isProd = process.env.NODE_ENV === "production";

if (!secret || secret.trim() === "") {
  throw new Error(
    "NUXT_AUTH_JS_SECRET is required. Add it to your .env file. Generate with: openssl rand -base64 32"
  );
}

// Validate secret strength
if (secret.length < 32) {
  throw new Error(
    "NUXT_AUTH_JS_SECRET must be at least 32 characters for security. Generate with: openssl rand -base64 32"
  );
}

// Email validation
function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

async function authenticateUser(
  identifier: string,
  password: string
): Promise<{ user: AuthUser; accessToken: string } | null> {
  if (!identifier || !password) {
    return null;
  }

  const config = useRuntimeConfig();
  const apiBaseUrl = config.apiBaseUrl || "http://localhost:8883";

  try {
    // Authenticate with external API
    const response = await $fetch<{
      data: {
        user: any;
        accessToken: string;
      };
    }>(`${apiBaseUrl}/auth/login`, {
      method: "POST",
      body: {
        username: identifier,
        password,
      },
    });

    if (response?.data?.user && response.data.accessToken) {
      const apiUser = response.data.user;

      // Map API user fields to AuthUser format
      const user: AuthUser = {
        id: String(apiUser.id), // Convert number to string
        email: apiUser.email,
        name: apiUser.username || apiUser.name || apiUser.email, // Use username as name
        role: apiUser.role || "user",
        organization: apiUser.organization || "Agrodata",
      };

      return {
        user,
        accessToken: response.data.accessToken,
      };
    }
  } catch (error: any) {
    console.error("External API authentication failed:", error);
    throw createError({
      statusCode: error.statusCode || 401,
      statusMessage: error.message || "Authentication failed",
    });
  }

  return null;
}

export default NuxtAuthHandler({
  secret,
  providers: [
    {
      id: "credentials",
      name: "Credentials",
      type: "credentials",
      credentials: {
        email: {
          label: "Email",
          type: "email",
          placeholder: "you@example.com",
        },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials: Record<string, string> | undefined) {
        const identifier = credentials?.email?.toString().trim().toLowerCase();
        const password = credentials?.password?.toString();

        if (!identifier || !password) {
          return null;
        }

        // Allow login by email or login alias
        const authResult = await authenticateUser(identifier, password);
        if (!authResult) {
          return null;
        }

        // Return user with access token embedded
        return {
          ...authResult.user,
          accessToken: authResult.accessToken,
        };
      },
    },
  ],
  callbacks: {
    async jwt({ token, user, trigger }) {
      // On sign in, add user to token
      if (user) {
        token.user = user as AuthUser;
        token.accessToken = (user as any).accessToken; // Store the access token
        token.iat = Math.floor(Date.now() / 1000); // Issued at
      }

      // Check token expiration on every request
      if (trigger === "update" && token.iat) {
        const tokenAge = Math.floor(Date.now() / 1000) - (token.iat as number);
        const maxAge = 30 * 24 * 60 * 60; // 30 days

        if (tokenAge > maxAge) {
          throw new Error("Token expired");
        }
      }

      return token;
    },
    async session({ session, token }) {
      if (token.user) {
        session.user = token.user as AuthUser;
      }
      if (token.accessToken) {
        (session as any).accessToken = token.accessToken as string;
      }
      return session;
    },
  },
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 days
    updateAge: 24 * 60 * 60, // Update session every 24 hours
  },
  pages: {
    signIn: "/login",
    error: "/auth/error", // Error page
  },
  // Security options (secure cookies enabled in production via NUXT_AUTH_URL https)
  cookies: {
    sessionToken: {
      name: isProd
        ? "__Host-next-auth.session-token"
        : "next-auth.session-token",
      options: {
        httpOnly: true,
        sameSite: "lax",
        path: "/",
        secure: isProd,
      },
    },
  },
});
