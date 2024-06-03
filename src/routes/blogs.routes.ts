import { Router } from "express";

import { getBlogsAllController } from "../controllers/blogs";

const blogsRouter = Router();

blogsRouter.get("/", getBlogsAllController);

export default blogsRouter;
