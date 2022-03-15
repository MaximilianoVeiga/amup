const express = require('express');
const router = express.Router();

const AuthController = require('../controllers/AuthController');

router.post('/auth/signin', AuthController.signin);

module.exports = router;
