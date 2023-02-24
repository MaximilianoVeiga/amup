const express = require("express");
const router = express.Router();

const HealthController = require("../controllers/HealthController");

router.get("/health", HealthController.show);

module.exports = router;
