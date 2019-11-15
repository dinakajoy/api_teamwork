const express = require('express');

const router = express.Router();

const auth = require('../middleware/authMiddleware');
const articleController = require('../controllers/ArticleController');

router.post('/', auth, articleController.createArticle);
router.patch('/:articleId', auth, articleController.editArticle);
router.delete('/:articleId', auth, articleController.deleteArticle);

module.exports = router;
