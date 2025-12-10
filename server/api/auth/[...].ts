import { NuxtAuthHandler } from "#auth";
import { promises as fs } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

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
const cwd = process.cwd();

if (!secret || secret.trim() === "") {
  throw new Error(
    "NUXT_AUTH_JS_SECRET is required. Add it to your .env file. Generate with: openssl rand -base64 32",
  );
}

// Validate secret strength
if (secret.length < 32) {
  throw new Error(
    "NUXT_AUTH_JS_SECRET must be at least 32 characters for security. Generate with: openssl rand -base64 32",
  );
}

// Email validation
function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

type MockUser = AuthUser & { password: string; login?: string };

const __dirname = dirname(fileURLToPath(import.meta.url));

let cachedUsers: MockUser[] | null = null;
async function loadMockUsers(): Promise<MockUser[]> {
  if (cachedUsers) return cachedUsers;

  try {
    // Try repository path (dev) and build path (dist/.output)
    const candidates = [
      join(cwd, "server/data/users.json"),
      join(__dirname, "../data/users.json"),
      join(__dirname, "../../data/users.json"),
    ];

    let contents: string | null = null;
    for (const path of candidates) {
      try {
        contents = await fs.readFile(path, "utf-8");
        break;
      } catch (e) {
        // keep trying next candidate
      }
    }

    if (!contents) {
      throw new Error("No users.json found in expected locations");
    }

    cachedUsers = JSON.parse(contents) as MockUser[];
  } catch (err) {
    console.error("Failed to load mock users, falling back to defaults:", err);
    cachedUsers = [
      {
        id: "admin-001",
        login: "admin",
        email: "admin@agrodata.com",
        password: "admin",
        name: "Admin User",
        role: "admin",
        organization: "WarehouseOps",
      },
    ];
  }

  return cachedUsers;
}

// TODO: Replace with actual external backend API call.
async function authenticateUser(
  identifier: string,
  password: string,
): Promise<AuthUser | null> {
  if (!identifier || !password) {
    return null;
  }

  const users = await loadMockUsers();
  const lower = identifier.toLowerCase();
    const user = users.find((u) => {
      const matchesEmail = u.email.toLowerCase() === lower;
      const matchesLogin = u.login?.toLowerCase() === lower;
      return (matchesEmail || matchesLogin) && u.password === password;
    });

  if (!user) {
    return null;
  }

  const { password: _, ...sanitizedUser } = user;
  return sanitizedUser;
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
        const user = await authenticateUser(identifier, password);
        return user;
      },
    },
  ],
  callbacks: {
    async jwt({ token, user, trigger }) {
      // On sign in, add user to token
      if (user) {
        token.user = user as AuthUser;
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
