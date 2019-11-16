const express = require('express');

const router = express.Router();

const auth = require('../middleware/authMiddleware');
const gifController = require('../controllers/GifController');

router.post('/', auth, gifController.createGif);
router.get('/:gifId', auth, gifController.getGif);
router.delete('/:gifId', auth, gifController.deleteGif);
router.post('/:gifId/comment', auth, gifController.commentGif);

module.exports = router;
