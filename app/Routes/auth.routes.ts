import express, { Router } from "express";

import AuthController from "#controllers/AuthController.js";

const router: Router = express.Router();

const authController = new AuthController();

router.post("/auth/signin", authController.signin);

export default router;
