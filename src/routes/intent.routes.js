const express = require('express');
const router = express.Router();

const IntentController = require('../controllers/IntentController');

router.get('/intent', IntentController.index);
router.post('/intent', IntentController.create);
router.delete('/intent', IntentController.destroy);

module.exports = router;
