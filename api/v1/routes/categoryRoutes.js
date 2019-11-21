const express = require('express');

const router = express.Router();

const accountAuth = require('../middleware/accountMiddleware');
const categoryController = require('../controllers/CategoryController');
const {
  categoryValidationRules, validate
} = require('../middleware/validationMiddleware');

router.post('/', accountAuth, categoryValidationRules(), validate, categoryController.createCategory);
router.get('/', categoryController.getCategories);
router.patch('/:categoryId', accountAuth, categoryValidationRules(), validate, categoryController.editCategory);
router.get('/:categoryId/articles', categoryController.getArticleCategory);

module.exports = router;
