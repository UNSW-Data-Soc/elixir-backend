// module aliases
import moduleAlias from "module-alias";
moduleAlias.addAlias("@", __dirname);

import express, { Express, Request, Response } from "express";
import bodyParser from "body-parser";

import session from "express-session";

import cors from "cors";

import swaggerJsdoc from "swagger-jsdoc";
import swaggerUi from "swagger-ui-express";

import { env } from "./env";

import { asyncHandler, wrapHTML } from "./lib/utils";
import HTTPError, { globalErrorHandler } from "./error";

import { displayLatestGithubCommit } from "./services/github/octokit";

import authRouter from "./routes/auth.routes";
import blogsRouter from "./routes/blogs.routes";
import coverPhotosRouter from "./routes/coverphotos.routes";
import eventsRouter from "./routes/events.routes";
import companiesRouter from "./routes/companies.routes";

// save userId in session
declare module "express-session" {
  interface SessionData {
    userId: string | null;
  }
}

const app: Express = express();
const port = env.PORT;

app.use(
  cors({
    credentials: true,
    origin: env.CORS_ORIGIN,
  })
);

app.use(bodyParser.urlencoded({ extended: false })); // parse application/x-www-form-urlencoded
app.use(bodyParser.json()); // parse application/json

// session middleware
app.use(
  session({
    secret: env.SECRET_KEY,
    resave: false,
    saveUninitialized: false,
    cookie: { httpOnly: true, secure: false, maxAge: 1000 * 60 * 60 * 24 },
  })
);

// test routes
app.get("/", (_: Request, res: Response) => {
  res.send("Hello, world!");
});
app.get(
  "/info",
  asyncHandler(async (_: Request, res: Response) => {
    const commitHTML = await displayLatestGithubCommit();
    res.send(wrapHTML(commitHTML));
  })
);
app.get("/error", () => {
  throw new HTTPError(400, "Bad request");
});

// routers
app.use("/auth", authRouter);
app.use("/blogs", blogsRouter);
app.use("/companies", companiesRouter);
app.use("/coverphotos", coverPhotosRouter);
app.use("/events", eventsRouter);

// global error handler: catches HTTPErrors and all other errors
app.use(globalErrorHandler);

// swagger: API docs
app.use("/docs", swaggerUi.serve, swaggerUi.setup(swaggerJsdoc(require("../swagger.json"))));

app.listen(port, () => {
  console.log(`⚡️ server is running at http://localhost:${port}`);
});
