import express from "express";
import { roleRouter } from "./role.route";
import { authRouter } from "./auth.route";
import { authenticateJWT } from "../middlewares/auth.middleware";
import { taskTypeRouter } from "./taskType.route";
import { projectRouter } from "./project.route";
import { taskRouter } from "./task.route";

const baseRouter = express.Router();

baseRouter.use("/auth", authRouter);
baseRouter.use("/roles", authenticateJWT, roleRouter);
baseRouter.use("/taskTypes", authenticateJWT, taskTypeRouter);
baseRouter.use("/projects", authenticateJWT, projectRouter);
baseRouter.use("/tasks", authenticateJWT, taskRouter);

export { baseRouter };
