import { db } from "./db";
import { blogs } from "./drizzle/schema";

export async function blogsGetAll() {
  const result = await db.select().from(blogs).all();

  return result.filter((blog) => blog.public);
}
