import { Router } from "express";

import { getJobPostingsAllController } from "@/controllers/jobPostings";

const jobPostingsRouter = Router();

jobPostingsRouter.get("/", getJobPostingsAllController);

export default jobPostingsRouter;
