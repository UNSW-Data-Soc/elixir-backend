import { Router } from "express";

import { getResourcesAllController } from "@/controllers/resources";

const resourcesRouter = Router();

resourcesRouter.get("/", getResourcesAllController);

export default resourcesRouter;
