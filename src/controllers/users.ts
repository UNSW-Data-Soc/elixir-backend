import { Request, Response } from "express";

import { getUserFromRequest, isAdmin } from "@/lib/auth";

import { db } from "@/db/db";

import { User } from "@/types/user";
import { asyncHandler } from "@/lib/utils";
import HTTPError from "@/error";

// CONTROLLERS
export const getUsersAllController = asyncHandler(async (req: Request, res: Response) => {
  const users = await usersGetAll(await getUserFromRequest(req));
  res.status(200).json(users);
});

// HELPERS
async function usersGetAll(user: User | null) {
  if (!user) throw new HTTPError(401, "Unauthorized");
  if (!isAdmin(user.role)) throw new HTTPError(403, "Forbidden");

  const res = await db.query.users.findMany({
    with: {
      yearsActive: true,
    },
  });

  return res;
}
