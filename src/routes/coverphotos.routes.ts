import { Router } from "express";

import { getCoverPhotosController } from "../controllers/coverphotos";

const coverPhotosRouter = Router();

coverPhotosRouter.get("/", getCoverPhotosController);

export default coverPhotosRouter;
