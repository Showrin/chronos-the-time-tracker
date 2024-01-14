import express from "express";
import * as RoleController from "../controllers/role.controller";

const roleRouter = express.Router();

roleRouter.post("/", RoleController.createRole);
roleRouter.get("/", RoleController.getRoles);
roleRouter.get("/:roleId", RoleController.getRoleById);
roleRouter.put("/:roleId", RoleController.updateRoleById);

export { roleRouter };
