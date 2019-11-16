/* eslint-disable no-useless-catch */
const FeedService = require('../services/FeedService');
const Util = require('../utils/Utils');

const util = new Util();

exports.getFeed = async (req, res) => {
  try {
    const result = await FeedService.getFeed();
    if (!result) {
      util.setError(400, 'Sorry, there was an error');
      return util.send(res);
    }
    util.setSuccess(200, result);
    return util.send(res);
  } catch (error) {
    // util.setError(400, error);
    // return util.send(res);
    throw error;
  }
};
