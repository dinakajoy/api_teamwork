const express = require('express');

const router = express.Router();

const accountAuth = require('../middleware/accountMiddleware');
const auth = require('../middleware/authMiddleware');
const categoryController = require('../controllers/CategoryController');
const {
  categoryValidationRules, validate
} = require('../middleware/validationMiddleware');

router.post('/', accountAuth, categoryValidationRules(), validate, categoryController.createCategory);
router.patch('/:categoryId', accountAuth, categoryValidationRules(), validate, categoryController.editCategory);

router.get('/', auth, categoryController.getCategories);
router.get('/:categoryId/articles', auth, categoryController.getArticleCategory);

module.exports = router;
