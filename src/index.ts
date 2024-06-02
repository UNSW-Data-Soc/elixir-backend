import express, { Express, NextFunction, Request, Response } from "express";
import bodyParser from "body-parser";

import session from "express-session";

import swaggerJsdoc from "swagger-jsdoc";
import swaggerUi from "swagger-ui-express";

import { env } from "./env";

import { wrapHTML } from "./utils";
import HTTPError, { globalErrorHandler } from "./error";

import { getUserFromRequest, login } from "./auth";
import { blogsGetAll } from "./blogs";
import { displayLatestGithubCommit } from "./github/octokit";
import { getCoverPhotos } from "./coverphotos";

declare module "express-session" {
  interface SessionData {
    userId: string | null;
  }
}

const app: Express = express();
const port = env.PORT;

app.use(bodyParser.urlencoded({ extended: false })); // parse application/x-www-form-urlencoded
app.use(bodyParser.json()); // parse application/json

app.use(
  session({
    secret: env.SECRET_KEY,
    resave: false,
    saveUninitialized: false,
    cookie: { httpOnly: true, secure: false, maxAge: 1000 * 60 * 60 * 24 },
  })
);

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
    if (!req.body?.email || !req.body?.password)
      throw new HTTPError(400, "No email or password given");
    const { email, password } = req.body;
    const id = await login({ email, password });
    req.session.userId = id;
    res.status(200).json({});
  })
);

app.post("/auth/logout", (req: Request, res: Response) => {
  req.session.destroy((err) => {
    if (err) throw new HTTPError(500, "Failed to destroy session");
    else res.status(200).json({});
  });
});

// blogs routes
app.get(
  "/blogs",
  asyncHandler(async (req: Request, res: Response) => {
    const blogs = await blogsGetAll(await getUserFromRequest(req));
    res.status(200).json(blogs);
  })
);

// coverphotos routes
app.get(
  "/coverphotos",
  asyncHandler(async (req: Request, res: Response) => {
    const coverPhotos = await getCoverPhotos(await getUserFromRequest(req));
    res.status(200).json(coverPhotos);
  })
);

app.use(globalErrorHandler);

app.use("/docs", swaggerUi.serve, swaggerUi.setup(swaggerJsdoc(require("../swagger.json"))));

app.listen(port, () => {
  console.log(`⚡️ server is running at http://localhost:${port}`);
});
