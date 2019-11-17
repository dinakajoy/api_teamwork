// const { check, validationResult } = require('express-validator');

// const getUserId = require('../middleware/getUserIdMiddleware');
const FlagService = require('../services/FlagService');
const Util = require('../utils/Utils');

const util = new Util();

exports.getFlags = async (req, res) => {
  try {
    const result = await FlagService.getFlags();
    if (!result) {
      util.setError(400, 'Sorry, there was an error');
      return util.send(res);
    }
    util.setSuccess(200, result);
    return util.send(res);
  } catch (error) {
    util.setError(400, error);
    return util.send(res);
  }
};
