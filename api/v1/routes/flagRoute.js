const express = require('express');

const router = express.Router();

const auth = require('../middleware/authMiddleware');
const accountAuth = require('../middleware/accountMiddleware');
const flagController = require('../controllers/FlagController');

router.get('/', auth, flagController.getFlags);
router.get('/:flagId', auth, flagController.getFlag);
router.delete('/:flagId', accountAuth, flagController.deleteFlag);

module.exports = router;
