import { checkTimeLogReadAuthority } from "./../middlewares/timeLog.middleware";
import express from "express";
import * as TimeLogController from "../controllers/timeLog.controller";
import { canAccess } from "../middlewares/auth.middleware";
import { checkTimeLogModificationAuthority } from "../middlewares/timeLog.middleware";

const timeLogRouter = express.Router();

timeLogRouter.get(
  "/",
  canAccess("*"),
  checkTimeLogReadAuthority,
  TimeLogController.getTimeLogs
);
timeLogRouter.get(
  "/:timeLogId",
  canAccess("*"),
  checkTimeLogReadAuthority,
  TimeLogController.findTimeLogById
);
timeLogRouter.post("/", canAccess("*"), TimeLogController.createTimeLog);

timeLogRouter.put(
  "/:timeLogId",
  canAccess("*"),
  checkTimeLogModificationAuthority,
  TimeLogController.updateTimeLogById
);
timeLogRouter.delete(
  "/:timeLogId",
  canAccess("*"),
  checkTimeLogModificationAuthority,
  TimeLogController.deleteTimeLogById
);

export { timeLogRouter };
