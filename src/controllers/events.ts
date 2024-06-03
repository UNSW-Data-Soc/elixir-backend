import { eq } from "drizzle-orm";
import { Request, Response } from "express";

import { getUserFromRequest, isModerator } from "@/lib/auth";

import { db } from "@/db/db";
import { events } from "@/db/schema";

import { User } from "@/types/user";
import { asyncHandler } from "@/lib/utils";

// CONTROLLERS
export const getEventsAllController = asyncHandler(async (req: Request, res: Response) => {
  const events = await eventsGetAll(await getUserFromRequest(req));
  res.status(200).json(events);
});

// HELPERS
async function eventsGetAll(user: User | null) {
  if (user && isModerator(user.role)) {
    return await db.query.events.findMany({
      with: {
        tags: {
          with: {
            tag: true,
          },
        },
      },
    });
  }

  return await db.query.events.findMany({
    with: {
      tags: {
        with: {
          tag: true,
        },
      },
    },
    where: eq(events.public, true),
  });
}
