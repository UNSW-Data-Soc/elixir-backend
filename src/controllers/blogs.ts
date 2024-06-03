import { eq } from "drizzle-orm";
import { Request, Response } from "express";

import { getUserFromRequest, isModerator } from "@/lib/auth";

import { db } from "@/db/db";
import { blogs } from "@/db/schema";

import { User } from "@/types/user";
import { asyncHandler } from "@/lib/utils";

// CONTROLLERS
export const getBlogsAllController = asyncHandler(async (req: Request, res: Response) => {
  const blogs = await blogsGetAll(await getUserFromRequest(req));
  res.status(200).json(blogs);
});

// HELPERS
async function blogsGetAll(user: User | null) {
  if (user && isModerator(user.role)) {
    return await db.select().from(blogs);
  }

  return await db.select().from(blogs).where(eq(blogs.public, true));
}
