const express = require('express');

const router = express.Router();

const auth = require('../middleware/authMiddleware');
const userController = require('../controllers/UserController');

router.post('/create-user', auth, userController.signup);
router.post('/signin', userController.signin);

module.exports = router;
