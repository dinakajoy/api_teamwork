const express = require('express');

const router = express.Router();

const userController = require('../controllers/UserController');

router.post('/create-user', userController.signup);

module.exports = router;