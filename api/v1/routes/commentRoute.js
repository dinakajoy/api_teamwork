const express = require('express');

const router = express.Router();

const auth = require('../middleware/authMiddleware');
const commentController = require('../controllers/CommentController');

router.post('/:commentId/flag', auth, commentController.flagComment);

module.exports = router;
