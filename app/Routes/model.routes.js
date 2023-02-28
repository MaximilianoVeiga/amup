import express from "express";

const router = express.Router();

import IntentController from "#controllers/IntentController.js";
import ModelController from "#controllers/ModelController.js";
import AuthMiddleware from "#middlewares/AuthMiddleware.js";

const authMiddleware = new AuthMiddleware();
const intentController = new IntentController();
const modelController = new ModelController();

router.get(
    "/detectIntent",
    authMiddleware.validateAuthToken,
    intentController.detect
);
router.get("/train", authMiddleware.validateAuthToken, modelController.train);

export default router;
