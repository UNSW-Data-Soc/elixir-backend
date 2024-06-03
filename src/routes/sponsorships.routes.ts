import { Router } from "express";

import { getSponsorshipsAllController } from "@/controllers/sponsorships";

const sponsorshipsRouter = Router();

sponsorshipsRouter.get("/", getSponsorshipsAllController);

export default sponsorshipsRouter;
