const express = require("express");
const router = express.Router();

const ModelController = require("../controllers/ModelController");
const IntentController = require("../controllers/IntentController");

router.get("/train", ModelController.train);
router.get("/detectIntent", IntentController.detect);

module.exports = router;
