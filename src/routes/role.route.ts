import express from "express";
import * as RoleController from "../controllers/role.controller";
import { canAccess } from "../middlewares/auth.middleware";

const roleRouter = express.Router();

roleRouter.get("/", canAccess("*"), RoleController.getRoles);

export { roleRouter };
