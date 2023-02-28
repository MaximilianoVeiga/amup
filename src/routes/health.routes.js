import express from "express";

const router = express.Router();

import HealthController from "../controllers/HealthController.js";

const healthController = new HealthController();

router.get("/health", healthController.show);

export default router;
