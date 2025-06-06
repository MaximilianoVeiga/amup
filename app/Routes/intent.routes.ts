import express, { Router } from "express";

const router: Router = express.Router();

import IntentController from "#controllers/IntentController.js";
import AuthMiddleware from "#middlewares/AuthMiddleware.js";

const authMiddleware = new AuthMiddleware();
const intentController = new IntentController();

router.get("/intent", authMiddleware.validateAuthToken, intentController.index);
router.post(
    "/intent",
    authMiddleware.validateAuthToken,
    intentController.create
);
router.put(
    "/intent/:id",
    authMiddleware.validateAuthToken,
    intentController.update
);
router.delete("/intent/:id", intentController.destroy);

export default router;
