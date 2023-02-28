import express from "express";

const router = express.Router();

import IntentController from "../controllers/IntentController.js";
import ModelController from "../controllers/ModelController.js";

const intentController = new IntentController();
const modelController = new ModelController();

router.get("/detectIntent", intentController.detect);
router.get("/train", modelController.train);

export default router;
