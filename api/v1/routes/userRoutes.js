const express = require('express');

const router = express.Router();

const accountAuth = require('../middleware/accountMiddleware');
const auth = require('../middleware/authMiddleware');
const {
  accountValidationRules, userValidationRules, passwordValidationRules, validate
} = require('../middleware/validationMiddleware');

const userController = require('../controllers/UserController');

router.post('/create-user', accountValidationRules(), validate, userController.signup);
router.patch('/edit-user/:userId', accountAuth, accountValidationRules(), validate, userController.editUser);
router.delete('/delete-user/:userId', accountAuth, userController.deleteUser);
router.post('/signin', userValidationRules(), validate, userController.signin);
router.patch('/change-photo', auth, userController.changePhoto);
router.patch('/change-password', auth, passwordValidationRules(), validate, userController.changePassword);

module.exports = router;
