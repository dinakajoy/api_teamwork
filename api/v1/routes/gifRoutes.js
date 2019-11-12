const express = require('express');

const router = express.Router();

const auth = require('../middleware/authMiddleware');
const gifController = require('../controllers/GifController');

router.post('/gif', auth, gifController.createGif);

module.exports = router;
