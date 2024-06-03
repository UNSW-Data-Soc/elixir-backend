import { Router } from "express";

import { getEventsAllController } from "@/controllers/events";

const eventsRouter = Router();

eventsRouter.get("/", getEventsAllController);

export default eventsRouter;
