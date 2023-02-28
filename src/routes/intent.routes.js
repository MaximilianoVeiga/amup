import express from "express";

const router = express.Router();

import IntentController from "../controllers/IntentController.js";
import AuthMiddleware from "../middleware/AuthMiddleware.js";

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
