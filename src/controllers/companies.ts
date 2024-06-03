import { asc } from "drizzle-orm";
import { Request, Response } from "express";

import { db } from "@/db/db";
import { companies } from "@/db/schema";

import { asyncHandler } from "@/lib/utils";

// CONTROLLERS
export const getCompaniesController = asyncHandler(async (_: Request, res: Response) => {
  const data = await db.select().from(companies).orderBy(asc(companies.name));
  res.status(200).json(data);
});
