import { and, eq, gt } from "drizzle-orm";
import { Request, Response } from "express";

import { getUserFromRequest, isModerator } from "@/lib/auth";

import { db } from "@/db/db";
import { companies, sponsorships } from "@/db/schema";

import { User } from "@/types/user";
import { asyncHandler } from "@/lib/utils";

// CONTROLLERS
export const getSponsorshipsAllController = asyncHandler(async (req: Request, res: Response) => {
  const spons = await sponsorshipsGetAll(await getUserFromRequest(req));
  res.status(200).json(spons);
});

// HELPERS
async function sponsorshipsGetAll(user: User | null) {
  if (user && isModerator(user.role)) {
    return (
      await db
        .select()
        .from(sponsorships)
        .fullJoin(companies, eq(sponsorships.company, companies.id))
    ).map((row) => ({ ...row.sponsorships, company: row.companies }));
  }

  return (
    await db
      .select()
      .from(sponsorships)
      .where(and(gt(sponsorships.expiration, new Date()), eq(sponsorships.public, true)))
      .fullJoin(companies, eq(sponsorships.company, companies.id))
  ).map((row) => ({ ...row.sponsorships, company: row.companies }));
}
