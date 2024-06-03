import { InferSelectModel } from "drizzle-orm";
import { users } from "../db/schema";

export type User = Omit<InferSelectModel<typeof users>, "passwordHash">;
