import { InferSelectModel } from "drizzle-orm";
import { users } from "../drizzle/schema";

export type User = Omit<InferSelectModel<typeof users>, "passwordHash">;
