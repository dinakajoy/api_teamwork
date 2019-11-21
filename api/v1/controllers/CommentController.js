/* eslint-disable no-useless-catch */
const getUserId = require('../middleware/getUserIdMiddleware');
const CommentService = require('../services/CommentService');
const Util = require('../utils/Utils');

const util = new Util();

exports.flagComment = async (req, res) => {
  const userId = await getUserId(req);
  const flagToAdd = {
    type: 'comment',
    typeId: +req.params.commentId,
    userId
  };
  try {
    const result = await CommentService.flagComment(flagToAdd);
    if (!result) {
      util.setError(400, 'Sorry, there was an error');
      return util.send(res);
    }
    if (result[0] === 'true') {
      util.setSuccess(201, {
        message: result[1],
        token: req.headers.authorization
      });
      return util.send(res);
    }
    util.setSuccess(201, {
      message: 'Comment successfully flagged as inappropriate',
      flagId: result[1].flagId,
      userId: result[1].userId,
      typeId: result[1].typeId,
      type: result[1].type,
      createdOn: result[1].createdOn,
      token: req.headers.authorization
    });
    return util.send(res);
  } catch (error) {
    util.setError(400, error);
    return util.send(res);
  }
};
