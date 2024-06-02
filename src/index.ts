import express, { Express, NextFunction, Request, Response } from "express";
import bodyParser from "body-parser";
import cookieParser from "cookie-parser";

import swaggerJsdoc from "swagger-jsdoc";
import swaggerUi from "swagger-ui-express";

import { env } from "./env";

import { wrapHTML } from "./utils";
import HTTPError, { globalErrorHandler } from "./error";

import { cookieJwtAuth, login, logout } from "./auth";
import { blogsGetAll } from "./blogs";
import { displayLatestGithubCommit } from "./github/octokit";

const app: Express = express();
const port = env.PORT;

app.use(bodyParser.urlencoded({ extended: false })); // parse application/x-www-form-urlencoded
app.use(bodyParser.json()); // parse application/json

app.use(cookieParser());

// auth middleware
app.use(cookieJwtAuth);

// wrap async functions to catch errors
const asyncHandler = (fn: Function) => (req: Request, res: Response, next: NextFunction) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};

// test routes
app.get("/", (req: Request, res: Response) => {
  res.send("Hello, world!");
});

app.get(
  "/info",
  asyncHandler(async (req: Request, res: Response) => {
    const commitHTML = await displayLatestGithubCommit();
    res.send(wrapHTML(commitHTML));
  })
);

app.get("/error", (req: Request, res: Response) => {
  throw new HTTPError(400, "Bad request");
});

// auth routes
app.post(
  "/auth/login",
  asyncHandler(async (req: Request, res: Response) => {
    // TODO: should we be passing this via the request body? or auth headers
    if (!req.body?.email || !req.body?.password)
      throw new HTTPError(400, "No email or password given");
    const { email, password } = req.body;
    const token = await login({ email, password });
    res.status(200).cookie("token", token, { httpOnly: true }).json({});
  })
);

app.post(
  "/auth/logout",
  asyncHandler(async (req: Request, res: Response) => {
    if (!req.user) throw new HTTPError(401, "No token provided");
    res.status(200).cookie("token", null).json({ message: "Logged out" });
  })
);

// blogs routes
app.get(
  "/blogs",
  asyncHandler(async (req: Request, res: Response) => {
    const blogs = await blogsGetAll();
    res.status(200).json(blogs);
  })
);

app.use(globalErrorHandler);

app.use("/docs", swaggerUi.serve, swaggerUi.setup(swaggerJsdoc(require("../swagger.json"))));

app.listen(port, () => {
  console.log(`⚡️ server is running at http://localhost:${port}`);
});
