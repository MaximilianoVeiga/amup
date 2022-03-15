const express = require('express');
const router = express.Router();

const HomeController = require('../controllers/HomeController');

router.get('/home/intents', HomeController.intents);

module.exports = router;
