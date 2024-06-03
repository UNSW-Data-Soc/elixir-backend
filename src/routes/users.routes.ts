import { Router } from "express";

import { getUsersAllController } from "@/controllers/users";

const usersRouter = Router();

usersRouter.get("/", getUsersAllController);

export default usersRouter;
