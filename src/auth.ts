import { createHash } from "crypto";
import { db } from "./db";
import { sessions, users } from "./drizzle/schema";
import { eq, and } from "drizzle-orm";
import { env } from "./env";
import HTTPError from "./error";

export const hash = (password: string) => {
  return createHash("sha256")
    .update(password + env.SECRET_KEY)
    .digest("hex");
};

async function createSession({ userId }: { userId: string }) {
  const sessionToken = crypto.randomUUID();
  const expires = new Date(Date.now() + 1000 * 60 * 60 * 24); // 1 day

  await db.insert(sessions).values({ sessionToken, userId, expires });

  return sessionToken;
}

async function deleteSession({ sessionToken }: { sessionToken: string }) {
  await db.delete(sessions).where(eq(sessions.sessionToken, sessionToken));
}

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

  const user = res[0];

  const sessionToken = await createSession({ userId: user.id });

  return sessionToken;
}

export async function logout({ sessionToken }: { sessionToken: string }) {
  await deleteSession({ sessionToken });
  return true; //  TODO: update to return false if token invalid
}
