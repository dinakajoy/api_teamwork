const express = require('express');

const router = express.Router();

const auth = require('../middleware/authMiddleware');
const gifController = require('../controllers/GifController');

router.post('/', auth, gifController.createGif);

module.exports = router;
