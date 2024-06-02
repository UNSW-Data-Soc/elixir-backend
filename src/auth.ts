import { createHash } from "crypto";
import { db } from "./db";
import { users } from "./drizzle/schema";
import { eq, and } from "drizzle-orm";
import { env } from "./env";
import HTTPError from "./error";
import { Request } from "express";
import { User } from "./types/user";
declare global {
  namespace Express {
    interface Request {
      user?: User | null;
    }
  }
}

export const hash = (password: string) => {
  return createHash("sha256")
    .update(password + env.SECRET_KEY)
    .digest("hex");
};

export async function login({ email, password }: { email: string; password: string }) {
  const res = await db
    .select()
    .from(users)
    .where(and(eq(users.email, email), eq(users.passwordHash, hash(password))));

  // check valid
  if (res.length === 0) throw new HTTPError(401, "Invalid email or password");
  if (res.length > 1) {
    console.error(
      "Multiple users with the same email and password hash found in the database. Should never happen."
    );
    throw new HTTPError(500, "Database error");
  }

  const { passwordHash, ...user } = res[0];
  return user.id;
}

export async function getUserFromToken({ id }: { id: string }) {
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

export async function getUserFromRequest(req: Request) {
  if (!req.session.userId) return null;
  return await getUserFromToken({ id: req.session.userId });
}

export function isAdmin(role: string) {
  return role === "admin";
}
export function isModerator(role: string) {
  return role === "moderator" || isAdmin(role);
}
