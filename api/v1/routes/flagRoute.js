const express = require('express');

const router = express.Router();

const auth = require('../middleware/authMiddleware');
const accountAuth = require('../middleware/accountMiddleware');
const flagController = require('../controllers/FlagController');

router.get('/', accountAuth, flagController.getFlags);
router.delete('/:typeId/:type', auth, flagController.deleteFlagged);

module.exports = router;
