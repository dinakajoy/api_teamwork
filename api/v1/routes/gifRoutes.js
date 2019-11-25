const express = require('express');

const router = express.Router();

const auth = require('../middleware/authMiddleware');
const gifController = require('../controllers/GifController');
const { gifValidationRules, commentValidationRules, validate } = require('../middleware/validationMiddleware');

router.post('/', auth, gifValidationRules(), validate, gifController.createGif);
router.get('/:gifId', auth, gifController.getGif);
router.delete('/:gifId', auth, gifController.deleteGif);
router.post('/:gifId/comment', auth, commentValidationRules(), validate, gifController.commentGif);
router.post('/:gifId/flag', auth, gifController.flagGif);

module.exports = router;
