import { createHash } from "crypto";
import { db } from "./db";
import { sessions, users } from "./drizzle/schema";
import { eq, and, InferSelectModel } from "drizzle-orm";
import { env } from "./env";
import HTTPError from "./error";
import { NextFunction, Request, Response } from "express";

import jwt from "jsonwebtoken";

declare global {
  namespace Express {
    interface Request {
      user?: (jwt.JwtPayload & User) | null;
    }
  }
}

type User = Omit<InferSelectModel<typeof users>, "passwordHash">;

const hash = (password: string) => {
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

  const { passwordHash, ...signedUser } = res[0];

  const sessionToken = jwt.sign(signedUser, env.SECRET_KEY, { expiresIn: "1h" });
  return sessionToken;
}

export async function logout({ sessionToken }: { sessionToken: string }) {
  return true; //  TODO: update to return false if token invalid
}

export function cookieJwtAuth(req: Request, _: Response, next: NextFunction) {
  console.log(req.cookies);
  const token = req.cookies.token;

  console.log(token);

  try {
    if (!token) throw new HTTPError(401, "No token provided");
    const user = jwt.verify(token, env.SECRET_KEY);
    req.user = user as jwt.JwtPayload & User;
    next();
  } catch (err) {
    req.user = null;
    next();
  }
}
