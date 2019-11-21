const express = require('express');

const router = express.Router();

const accountAuth = require('../middleware/accountMiddleware');
const auth = require('../middleware/authMiddleware');
const {
  validate, accountValidationRules, userValidationRules, passwordValidationRules
} = require('../middleware/validationMiddleware');

const userController = require('../controllers/UserController');

router.post('/create-user', accountAuth, accountValidationRules(), validate, userController.signup);
router.post('/signin', userValidationRules(), validate, userController.signin);
router.get('/users', accountAuth, userController.getUsers);
router.get('/users/:userId', accountAuth, userController.getUsers);
router.patch('/change-photo', auth, userController.changePhoto);
router.patch('/change-password', auth, passwordValidationRules(), validate, userController.changePassword);
router.patch('/users/:userId', accountAuth, accountValidationRules(), validate, userController.editUser);
router.delete('/users/:userId', accountAuth, userController.deleteUser);

module.exports = router;
