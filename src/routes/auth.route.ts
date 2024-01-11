import express from "express";
import * as AuthController from "../controllers/auth.controller";

const router = express.Router();

router.post("/signup", AuthController.signup);
router.post("/signin", AuthController.signin);

export default router;
