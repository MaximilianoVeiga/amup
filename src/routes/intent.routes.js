const express = require('express');
const router = express.Router();

const IntentController = require('../controllers/IntentController');

router.get('/detectIntent', IntentController.detect);
router.get('/train', IntentController.train);
router.post('/addIntent', IntentController.create);

module.exports = router;
