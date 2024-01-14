import express from "express";
import { roleRouter } from "./role.route";
import { authRouter } from "./auth.route";

const baseRouter = express.Router();

baseRouter.use("/api/auth", authRouter);
baseRouter.use("/api/roles", roleRouter);

export { baseRouter };
