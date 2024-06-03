import { db } from "../db/db";
import { users } from "../db/schema";
import HTTPError from "../error";
import { Request } from "express";
import { eq } from "drizzle-orm";

/**
 * @returns user object if the id is valid
 */
async function getUserFromToken({ id }: { id: string }) {
  const res = await db.select().from(users).where(eq(users.id, id));

  if (res.length === 0) return null;
  if (res.length > 1) {
    console.error(
      "Multiple users with the same session token found in the database. Should never happen."
    );
    throw new HTTPError(500, "Database error");
  }

  const { passwordHash, ...signedUser } = res[0];
  return signedUser;
}

/**
 * @returns user object if the session is valid
 */
export async function getUserFromRequest(req: Request) {
  if (!req.session.userId) return null;
  return await getUserFromToken({ id: req.session.userId });
}

/**
 * @returns true if the role is admin
 */
export function isAdmin(role: string) {
  return role === "admin";
}
/**
 * @returns true if the role is moderator or admin
 */
export function isModerator(role: string) {
  return role === "moderator" || isAdmin(role);
}
