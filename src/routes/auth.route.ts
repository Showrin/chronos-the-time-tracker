import express from "express";
import * as AuthController from "../controllers/auth.controller";

const authRouter = express.Router();

authRouter.post("/signup", AuthController.signup);
authRouter.post("/signin", AuthController.signin);
authRouter.post("/logout", AuthController.logout);

export { authRouter };
