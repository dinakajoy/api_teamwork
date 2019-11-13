const express = require('express');

const router = express.Router();

const accountAuth = require('../middleware/accountMiddleware');
const userController = require('../controllers/UserController');

router.post('/create-user', accountAuth, userController.signup);
router.post('/signin', userController.signin);

module.exports = router;
