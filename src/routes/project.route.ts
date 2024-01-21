import express from "express";
import * as ProjectController from "../controllers/project.controller";
import { canAccess } from "../middlewares/auth.middleware";

const projectRouter = express.Router();

projectRouter.get("/", canAccess("*"), ProjectController.getProjects);
projectRouter.get(
  "/:projectId",
  canAccess("*"),
  ProjectController.findProjectById
);

projectRouter.post(
  "/",
  canAccess({ manager: true }),
  ProjectController.createProject
);
projectRouter.put(
  "/:projectId",
  canAccess({ manager: true }),
  ProjectController.updateProjectById
);
projectRouter.delete(
  "/:projectId",
  canAccess({}),
  ProjectController.deleteProjectById
);
projectRouter.put(
  "/:projectId/restore",
  canAccess({}),
  ProjectController.restoreProjectById
);

export { projectRouter };
