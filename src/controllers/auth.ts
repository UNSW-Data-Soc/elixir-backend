import { createHash } from "crypto";
import { eq, and } from "drizzle-orm";
import { Request, Response } from "express";

import { env } from "@/env";

import HTTPError from "@/error";

import { db } from "@/db/db";
import { users } from "@/db/schema";

import { asyncHandler } from "@/lib/utils";

// CONTROLLERS
export const loginController = asyncHandler(async (req: Request, res: Response) => {
  if (!req.body?.email || !req.body?.password)
    throw new HTTPError(400, "No email or password given");
  const { email, password } = req.body;
  const id = await login({ email, password });
  req.session.userId = id;
  res.status(200).json({});
});

export const logoutController = (req: Request, res: Response) => {
  req.session.destroy((err) => {
    if (err) throw new HTTPError(500, "Failed to destroy session");
    else res.status(200).json({});
  });
};

// HELPERS
/**
 * Hash a password using SHA256
 */
export const hash = (password: string) => {
  return createHash("sha256")
    .update(password + env.SECRET_KEY)
    .digest("hex");
};

/**
 * @returns user id if the email and password are correct
 * @throws HTTPError(401) if the email or password are incorrect
 */
async function login({ email, password }: { email: string; password: string }) {
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
