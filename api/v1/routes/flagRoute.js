const express = require('express');

const router = express.Router();

const auth = require('../middleware/authMiddleware');
const flagController = require('../controllers/FlagController');

router.get('/', auth, flagController.getFlags);
// router.get('/:flagId', auth, flagController.getFlag);
// router.delete('/:flagId', auth, flagController.deleteFlag);

module.exports = router;
