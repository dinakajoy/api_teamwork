/* eslint-disable no-useless-catch */
const getUserId = require('../middleware/getUserIdMiddleware');
const CommentService = require('../services/CommentService');
const Util = require('../utils/Utils');

const util = new Util();

exports.flagComment = async (req, res) => {
  const userId = await getUserId(req);
  const flagToAdd = {
    userId,
    type: 'comment',
    typeId: +req.params.commentId
  };
  try {
    const result = await CommentService.flagComment(flagToAdd);
    if (!result) {
      util.setError(400, 'Sorry, there was an error');
      return util.send(res);
    }
    util.setSuccess(200, {
      result,
      token: req.headers.authorization
    });
    return util.send(res);
  } catch (error) {
    util.setError(400, error);
    return util.send(res);
  }
};

exports.editComment = async (req, res) => {
  const userId = await getUserId(req);
  const commentDetails = {
    commentId: req.params.commentId,
    userId,
    comment: req.body.comment
  };
  try {
    const result = await CommentService.editComment(commentDetails);
    if (!result) {
      util.setError(404, 'Sorry, comment was not found');
      return util.send(res);
    }
    util.setSuccess(200, {
      result,
      token: req.headers.authorization
    });
    return util.send(res);
  } catch (error) {
    util.setError(400, error);
    return util.send(res);
  }
};

exports.deleteComment = async (req, res) => {
  const userId = await getUserId(req);
  const commentDetails = {
    commentId: req.params.commentId,
    userId
  };
  try {
    const result = await CommentService.deleteComment(commentDetails);
    if (!result) {
      util.setError(404, 'Sorry, comment was not found');
      return util.send(res);
    }
    util.setSuccess(200, {
      result,
      token: req.headers.authorization
    });
    return util.send(res);
  } catch (error) {
    util.setError(400, error);
    return util.send(res);
  }
};
