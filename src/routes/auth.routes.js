import express from "express";

import AuthController from "../controllers/AuthController.js";

const router = express.Router();

const authController = new AuthController();

router.post("/auth/signin", authController.signin);

export default router;
