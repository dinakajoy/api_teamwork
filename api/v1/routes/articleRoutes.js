const express = require('express');

const router = express.Router();

const auth = require('../middleware/authMiddleware');
const articleController = require('../controllers/ArticleController');

router.post('/', auth, articleController.createArticle);

module.exports = router;
