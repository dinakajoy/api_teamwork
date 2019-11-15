const express = require('express');

const router = express.Router();

const auth = require('../middleware/authMiddleware');
const articleController = require('../controllers/ArticleController');

router.post('/', auth, articleController.createArticle);
router.patch('/:articleId', auth, articleController.editArticle);

module.exports = router;
