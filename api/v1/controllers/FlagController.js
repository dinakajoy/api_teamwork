const FlagService = require('../services/FlagService');
const Util = require('../utils/Utils');

const util = new Util();

exports.getFlags = async (req, res) => {
  try {
    const result = await FlagService.getFlaggedItems();
    if (!result) {
      util.setError(404, 'Sorry, no flag found');
      return util.send(res);
    }
    util.setSuccess(200, result);
    return util.send(res);
  } catch (error) {
    util.setError(400, error);
    return util.send(res);
  }
};

exports.deleteFlagged = async (req, res) => {
  const flagToDelete = {
    typeId: +req.params.typeId,
    type: req.params.type
  };
  try {
    const result = await FlagService.deleteFlagByItem(flagToDelete);
    if (!result) {
      util.setError(404, 'Flag not found');
      return util.send(res);
    }
    util.setSuccess(200, {
      message: 'Successfully deleted flagged item'
    });
    return util.send(res);
  } catch (error) {
    util.setError(500, error);
    return util.send(res);
  }
};
