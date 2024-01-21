import express from "express";
import * as TaskTypeController from "../controllers/taskType.controller";
import { canAccess } from "../middlewares/auth.middleware";

const taskTypeRouter = express.Router();

taskTypeRouter.get("/", canAccess("*"), TaskTypeController.getTaskTypes);
taskTypeRouter.get(
  "/:taskTypeId",
  canAccess("*"),
  TaskTypeController.getTaskTypeById
);

taskTypeRouter.post(
  "/",
  canAccess({ lead: true }),
  TaskTypeController.createTaskType
);
taskTypeRouter.put(
  "/:taskTypeId",
  canAccess({ lead: true }),
  TaskTypeController.updateTaskTypeById
);
taskTypeRouter.delete(
  "/:taskTypeId",
  canAccess({ lead: true }),
  TaskTypeController.deleteTaskTypeById
);
taskTypeRouter.put(
  "/:taskTypeId/restore",
  canAccess({ lead: true }),
  TaskTypeController.restoreTaskTypeById
);

export { taskTypeRouter };
