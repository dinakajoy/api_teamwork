const express = require('express');

const router = express.Router();

const accountAuth = require('../middleware/accountMiddleware');
const categoryController = require('../controllers/CategoryController');
const {
  categoryValidationRules, validate
} = require('../middleware/validationMiddleware');

router.post('/', accountAuth, categoryValidationRules(), validate, categoryController.createCategory);
router.get('/', categoryController.getCategories);
router.get('/:categoryId', categoryController.getCategory);
router.get('/:categoryId/articles', categoryController.getArticleCategory);
router.put('/:categoryId', accountAuth, categoryValidationRules(), validate, categoryController.editCategory);
router.delete('/:categoryId', accountAuth, categoryController.deleteCategory);

module.exports = router;
