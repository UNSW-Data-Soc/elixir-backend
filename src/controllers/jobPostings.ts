import { eq, gt } from "drizzle-orm";
import { Request, Response } from "express";

import { getUserFromRequest, isModerator } from "@/lib/auth";

import { db } from "@/db/db";
import { companies, jobPostings } from "@/db/schema";

import { User } from "@/types/user";
import { asyncHandler } from "@/lib/utils";

// CONTROLLERS
export const getJobPostingsAllController = asyncHandler(async (req: Request, res: Response) => {
  const jobs = await jobPostingsGetAll(await getUserFromRequest(req));
  res.status(200).json(jobs);
});

// HELPERS
async function jobPostingsGetAll(user: User | null) {
  if (user && isModerator(user.role)) {
    return (
      await db.select().from(jobPostings).fullJoin(companies, eq(jobPostings.company, companies.id))
    ).map((row) => ({ ...row.jobPostings, company: row.companies }));
  }

  return (
    await db
      .select()
      .from(jobPostings)
      .fullJoin(companies, eq(jobPostings.company, companies.id))
      .where(gt(jobPostings.expiration, new Date()))
  ).map((row) => ({ ...row.jobPostings, company: row.companies }));
}
