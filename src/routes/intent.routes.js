import express from "express";

const router = express.Router();

import IntentController from "../controllers/IntentController.js";

const intentController = new IntentController();

router.get("/intent", intentController.index);
router.post("/intent", intentController.create);
router.put("/intent/:id", intentController.update);
router.delete("/intent/:id", intentController.destroy);

export default router;
