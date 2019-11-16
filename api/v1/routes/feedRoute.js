const express = require('express');

const router = express.Router();

const auth = require('../middleware/authMiddleware');
const feedController = require('../controllers/FeedController');

router.get('/', auth, feedController.getFeed);

module.exports = router;
