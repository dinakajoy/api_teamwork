const express = require('express');

const router = express.Router();

const auth = require('../middleware/authMiddleware');
const articleController = require('../controllers/ArticleController');
const {
  articleValidationRules, commentValidationRules, validate
} = require('../middleware/validationMiddleware');

router.post('/', auth, articleValidationRules(), validate, articleController.createArticle);
router.get('/:articleId', auth, articleController.getArticle);
router.patch('/:articleId', auth, articleValidationRules(), validate, articleController.editArticle);
router.delete('/:articleId', auth, articleController.deleteArticle);
router.post('/:articleId/comment', auth, commentValidationRules(), validate, articleController.commentArticle);
router.post('/:articleId/flag', auth, articleController.flagArticle);

module.exports = router;
