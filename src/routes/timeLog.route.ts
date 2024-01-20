import express from "express";
import * as TimeLogController from "../controllers/timeLog.controller";
import { canAccess } from "../middlewares/auth.middleware";
import { checkTimeLogAuthority } from "../middlewares/timeLog.middleware";

const timeLogRouter = express.Router();

timeLogRouter.get("/", canAccess("*"), TimeLogController.getAllTimeLogs);
timeLogRouter.get(
  "/:timeLogId",
  canAccess("*"),
  TimeLogController.findTimeLogById
);
timeLogRouter.post("/", canAccess("*"), TimeLogController.createTimeLog);

timeLogRouter.put(
  "/:timeLogId",
  checkTimeLogAuthority,
  TimeLogController.updateTimeLogById
);
timeLogRouter.delete(
  "/:timeLogId",
  checkTimeLogAuthority,
  TimeLogController.deleteTimeLogById
);

export { timeLogRouter };
