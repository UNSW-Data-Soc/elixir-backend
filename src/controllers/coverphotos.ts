import { desc } from "drizzle-orm";
import { Request, Response } from "express";

import { getUserFromRequest, isModerator } from "@/lib/auth";

import { User } from "@/types/user";

import { db } from "@/db/db";
import { coverPhotos } from "@/db/schema";
import { asyncHandler } from "@/lib/utils";

// CONTROLLERS
export const getCoverPhotosController = asyncHandler(async (req: Request, res: Response) => {
  const coverPhotos = await getCoverPhotos(await getUserFromRequest(req));
  res.status(200).json(coverPhotos);
});

// HELPERS
async function getCoverPhotos(user: User | null) {
  if (user && isModerator(user.role)) {
    const result = await db.select().from(coverPhotos);
    return result;
  }

  const result = await db.select().from(coverPhotos).orderBy(desc(coverPhotos.createdAt)).limit(1);
  return result;
}
