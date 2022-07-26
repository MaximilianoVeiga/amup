const express = require('express');
const router = express.Router();

const IAController = require('../controllers/IAController');

router.get('/detectIntent', IAController.detect);
router.get('/train', IAController.train);


module.exports = router;
