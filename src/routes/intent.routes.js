const express = require('express');
const router = express.Router();

const IntentController = require('../controllers/IntentController');

router.get('/detectIntent', IntentController.detect);
router.post('/addIntent', IntentController.create);
router.delete('/removeIntent', IntentController.destroy);

module.exports = router;
