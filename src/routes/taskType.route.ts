import express from "express";
import * as TaskTypeController from "../controllers/taskType.controller";
import { canAccess } from "../middlewares/auth.middleware";

const taskTypeRouter = express.Router();

taskTypeRouter.post(
  "/",
  canAccess({ lead: true }),
  TaskTypeController.createTaskType
);
taskTypeRouter.get("/", canAccess("*"), TaskTypeController.getAllTaskTypes);

export { taskTypeRouter };
