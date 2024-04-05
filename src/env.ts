import dotenv from "dotenv";
import { z } from "zod";

dotenv.config();

const DEFAULT_PORT = 8000;

const e = {
  PORT: process.env.PORT,
  TURSO_DATABASE_URL: process.env.TURSO_DATABASE_URL,
  TURSO_AUTH_TOKEN: process.env.TURSO_AUTH_TOKEN,
  GITHUB_ACCESS_TOKEN: process.env.GITHUB_ACCESS_TOKEN,
};

const envSchema = z.object({
  PORT: z.number({ coerce: true }).default(DEFAULT_PORT),
  TURSO_DATABASE_URL: z.string().min(1),
  TURSO_AUTH_TOKEN: z.string().min(1),
  GITHUB_ACCESS_TOKEN: z.string().min(1),
});

export const env = envSchema.parse(e);
