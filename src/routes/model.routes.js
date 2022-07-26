const express = require('express');
const router = express.Router();

const ModelController = require('../controllers/ModelController');

router.get('/detectIntent', ModelController.detect);
router.get('/train', IAController.train);


module.exports = router;
