const express = require('express');

const router = express.Router();
const accountAuth = require('../middleware/accountMiddleware');
const auth = require('../middleware/authMiddleware');
const userController = require('../controllers/UserController');
const {
  validate, accountValidationRules, accountUpdateValidationRules, userValidationRules, passwordValidationRules
} = require('../middleware/validationMiddleware');

router.post('/create-admin', accountValidationRules(), validate, userController.signup);
router.post('/signin', userValidationRules(), validate, userController.signin);

router.post('/create-user', accountAuth, accountValidationRules(), validate, userController.signup);
router.patch('/users/:userId', accountAuth, accountUpdateValidationRules(), validate, userController.editUser);
router.delete('/users/:userId', accountAuth, userController.deleteUser);

router.get('/users', auth, userController.getUsers);
router.get('/users/:userId', auth, userController.getUser);
router.patch('/change-photo', auth, userController.changePhoto);
router.patch('/change-password', auth, passwordValidationRules(), validate, userController.changePassword);

module.exports = router;
