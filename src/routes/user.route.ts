import express from "express";
import * as UserController from "../controllers/user.controller";
import { canAccess } from "../middlewares/auth.middleware";
import { checkUserAuthority } from "../middlewares/user.middleware";

const userRouter = express.Router();

userRouter.get("/", canAccess("*"), UserController.getAllUsers);
userRouter.get("/:userId", canAccess("*"), UserController.findUserById);
userRouter.get(
  "/:userId/subordinates",
  canAccess("*"),
  UserController.findSubordinates
);

userRouter.put(
  "/:userId",
  canAccess("*"),
  checkUserAuthority,
  UserController.updateUserById
);

userRouter.put(
  "/:userId/change-role",
  canAccess({}),
  UserController.changeRole
);
userRouter.put(
  "/:userId/change-manager",
  canAccess({}),
  UserController.changeManager
);
userRouter.delete("/:userId", canAccess({}), UserController.deleteUserById);
userRouter.put(
  "/:userId/restore",
  canAccess({}),
  UserController.restoreUserById
);

export { userRouter };
