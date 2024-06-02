import { desc } from "drizzle-orm";
import { isModerator } from "./auth";
import { db } from "./db";
import { coverPhotos } from "./drizzle/schema";
import { User } from "./types/user";

export async function getCoverPhotos(user: User | null) {
  if (user && isModerator(user.role)) {
    const result = await db.select().from(coverPhotos);
    return result;
  }

  const result = await db.select().from(coverPhotos).orderBy(desc(coverPhotos.createdAt)).limit(1);
  return result;
}
