import express from "express";
import * as RoleController from "../controllers/role.controller";
import { canAccess } from "../middlewares/auth.middleware";

const roleRouter = express.Router();

// roleRouter.post("/", RoleController.createRole);
roleRouter.get("/", canAccess("*"), RoleController.getRoles);
// roleRouter.get("/:roleId", RoleController.getRoleById);
// roleRouter.put("/:roleId", RoleController.updateRoleById);
// roleRouter.delete("/:roleId", RoleController.deleteRoleById);
// roleRouter.put("/:roleId/reactivate", RoleController.reactivateRoleById);

export { roleRouter };
