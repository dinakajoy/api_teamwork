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

exports.getFlag = async (req, res) => {
  const flagId = req.params.flagId;
  try {
    const result = await FlagService.getFlag(flagId);
    if (!result) {
      util.setError(400, 'Sorry, there was an error');
      return util.send(res);
    }
    util.setSuccess(200, result);
    return util.send(res);
  } catch (error) {
    util.setError(500, error);
    return util.send(res);
  }
};

exports.deleteFlag = async (req, res) => {
  const flagId = req.params.flagId;
  try {
    const result = await FlagService.deleteFlag(flagId);
    if (!result) {
      util.setError(400, 'Sorry, there was an error');
      return util.send(res);
    }
    if (result.length === 0) {
      util.setError(404, 'Sorry, flag not found');
      return util.send(res);
    }
    util.setSuccess(200, result);
    return util.send(res);
  } catch (error) {
    util.setError(500, error);
    return util.send(res);
  }
};
