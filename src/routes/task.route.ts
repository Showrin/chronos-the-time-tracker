import express from "express";
import * as TaskController from "../controllers/task.controller";
import { canAccess } from "../middlewares/auth.middleware";

const taskRouter = express.Router();

taskRouter.get("/", canAccess("*"), TaskController.getAllTasks);
taskRouter.get("/:taskId", canAccess("*"), TaskController.findTaskById);
taskRouter.post("/", canAccess("*"), TaskController.createTask);
taskRouter.put("/:taskId", canAccess("*"), TaskController.updateTaskById);

taskRouter.delete("/:taskId", canAccess({}), TaskController.deleteTaskById);
taskRouter.put(
  "/:taskId/restore",
  canAccess({}),
  TaskController.restoreTaskById
);

export { taskRouter };
