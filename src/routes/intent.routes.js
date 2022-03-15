const express = require('express');
const router = express.Router();

const IntentController = require('../controllers/IntentController');

router.get('/detectIntent', IntentController.detect);
router.post('/addIntent', IntentController.create);
router.delete('/removeIntent', IntentController.destroy);
router.get('/train', IntentController.train);

router.get('/health', IntentController.health);


module.exports = router;
