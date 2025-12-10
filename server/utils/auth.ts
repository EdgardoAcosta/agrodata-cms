import { getServerSession } from "#auth";
import { createError } from "h3";
import type { H3Event } from "h3";

/**
 * Ensures a valid authenticated session exists for the incoming request.
 * Throws a 401 HTTP error if no session is present.
 */
export async function requireUserSession(event: H3Event) {
  const session = await getServerSession(event);

  if (!session || !session.user) {
    throw createError({ statusCode: 401, statusMessage: "Unauthorized" });
  }

  return session;
}
