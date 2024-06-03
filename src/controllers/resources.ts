import { eq } from "drizzle-orm";
import { Request, Response } from "express";

import { getUserFromRequest, isModerator } from "@/lib/auth";

import { db } from "@/db/db";
import { resources } from "@/db/schema";

import { User } from "@/types/user";
import { asyncHandler } from "@/lib/utils";

// CONTROLLERS
export const getResourcesAllController = asyncHandler(async (req: Request, res: Response) => {
  const result = await resourcesGetAll(await getUserFromRequest(req));
  res.status(200).json(result);
});

// HELPERS
async function resourcesGetAll(user: User | null) {
  if (user && isModerator(user.role)) {
    return await db.query.resources.findMany({
      with: {
        tags: {
          with: {
            tag: true,
          },
        },
      },
    });
  }

  return await db.query.resources.findMany({
    with: {
      tags: {
        with: {
          tag: true,
        },
      },
    },
    where: eq(resources.public, true),
  });
  // return await db.select().from(resources).where(eq(resources.public, true));
}
