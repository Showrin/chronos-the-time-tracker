import express from "express";
import { roleRouter } from "./role.route";
import { authRouter } from "./auth.route";
import { authenticateJWT } from "../middlewares/auth.middleware";

const baseRouter = express.Router();

baseRouter.use("/api/auth", authRouter);
baseRouter.use("/api/roles", authenticateJWT, roleRouter);

export { baseRouter };