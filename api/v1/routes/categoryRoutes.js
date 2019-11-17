const express = require('express');

const router = express.Router();

const accountAuth = require('../middleware/accountMiddleware');
const categoryController = require('../controllers/CategoryController');

router.post('/', accountAuth, categoryController.createCategory);
router.get('/', categoryController.getCategories);
router.get('/:categoryId', categoryController.getCategory);
router.get('/:categoryId/articles', categoryController.getArticleCategory);
router.put('/:categoryId', accountAuth, categoryController.editCategory);
router.delete('/:categoryId', accountAuth, categoryController.deleteCategory);

module.exports = router;
