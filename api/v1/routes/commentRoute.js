const express = require('express');

const router = express.Router();

const auth = require('../middleware/authMiddleware');
const {
  commentValidationRules, validate
} = require('../middleware/validationMiddleware');
const commentController = require('../controllers/CommentController');

router.patch('/:commentId', auth, commentValidationRules(), validate, commentController.editComment);
router.delete('/:commentId', auth, commentController.deleteComment);
router.post('/:commentId/flag', auth, commentController.flagComment);

module.exports = router;
