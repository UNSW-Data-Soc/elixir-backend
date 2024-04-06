import express, { Express, Request, Response } from "express";
import { blogsGetAll } from "./blogs";
import { env } from "./env";
import { displayLatestGithubCommit } from "./github/octokit";
import { wrapHTML } from "./utils";

const app: Express = express();
const port = env.PORT;

app.get("/", (req: Request, res: Response) => {
  res.send("Hello, world!");
});

app.get("/info", async (req: Request, res: Response) => {
  const commitHTML = await displayLatestGithubCommit();
  res.send(wrapHTML(commitHTML));
});

app.get("/blogs", async (req: Request, res: Response) => {
  const blogs = await blogsGetAll();
  res.status(200).json(blogs);
});

app.listen(port, () => {
  console.log(`⚡️ server is running at http://localhost:${port}`);
});
