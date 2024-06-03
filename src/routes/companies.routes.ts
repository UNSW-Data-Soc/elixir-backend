import { Router } from "express";

import { getCompaniesController } from "@/controllers/companies";

const companiesRouter = Router();

companiesRouter.get("/", getCompaniesController);

export default companiesRouter;
