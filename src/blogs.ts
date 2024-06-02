import { eq } from "drizzle-orm";
import { isModerator } from "./auth";
import { db } from "./db";
import { blogs } from "./drizzle/schema";
import { User } from "./types/user";

export async function blogsGetAll(user: User | null) {
  if (user && isModerator(user.role)) {
    return await db.select().from(blogs);
  }

  return await db.select().from(blogs).where(eq(blogs.public, true));
}
