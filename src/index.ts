import express, { Express, Request, Response } from "express";
import { blogsGetAll } from "./blogs";
import { env } from "./env";

const app: Express = express();
const port = env.PORT;

app.get("/", (req: Request, res: Response) => {
  res.send("Hello, world!");
});

app.get("/blogs", async (req: Request, res: Response) => {
  const blogs = await blogsGetAll();
  res.status(200).json(blogs);
});

app.listen(port, () => {
  console.log(`⚡️ server is running at http://localhost:${port}`);
});
