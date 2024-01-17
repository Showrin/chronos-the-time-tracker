import express from "express";
import { roleRouter } from "./role.route";
import { authRouter } from "./auth.route";
import { authenticateJWT } from "../middlewares/auth.middleware";
import { taskTypeRouter } from "./taskType.route";

const baseRouter = express.Router();

baseRouter.use("/auth", authRouter);
baseRouter.use("/roles", authenticateJWT, roleRouter);
baseRouter.use("/taskTypes", authenticateJWT, taskTypeRouter);

export { baseRouter };
