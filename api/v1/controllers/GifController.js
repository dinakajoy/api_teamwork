const getUserId = require('../middleware/getUserIdMiddleware');
const GifService = require('../services/GifService');
const Helpers = require('../helper/Helper');
const Util = require('../utils/Utils');

const util = new Util();

exports.createGif = async (req, res) => {
  const file = req.files.gif;
  if (file.mimetype !== 'image/gif') {
    util.setError(415, 'Please upload a GIF file');
    return util.send(res);
  }
  const cloudGifUrl = await Helpers.pushToCloudinary(file.tempFilePath);
  if (!cloudGifUrl) {
    util.setError(500, 'There was an error');
    return util.send(res);
  }
  const userId = await getUserId(req);
  const newGif = {
    title: req.body.title,
    imageUrl: cloudGifUrl.secure_url,
    public_id: cloudGifUrl.public_id,
    userId
  };
  try {
    const row = await GifService.createGif(newGif);
    const result = row[0];
    util.setSuccess(201, {
      message: 'GIF image successfully posted',
      gifId: result.gifId,
      title: result.title,
      imageUrl: result.imageUrl,
      public_id: result.public_id,
      createdOn: result.createdOn,
      token: req.headers.authorization,
      userId: result.userId
    });
    return util.send(res);
  } catch (error) {
    util.setError(500, error);
    return util.send(res);
  }
};

exports.getGif = async (req, res) => {
  const gifId = +req.params.gifId;
  try {
    const resp = await GifService.getGif(gifId);
    if (!res) {
      util.setError(400, 'Sorry, there was an error');
      return util.send(res);
    }
    const result = resp[0];
    util.setSuccess(200, {
      gifId: result.gifId,
      title: result.title,
      imageUrl: result.imageUrl,
      public_id: result.public_id,
      createdOn: result.createdOn,
      author: result.author,
      comments: resp[1],
      flags: resp[2],
      token: req.headers.authorization
    });
    return util.send(res);
  } catch (error) {
    util.setError(400, error);
    return util.send(res);
  }
};

exports.deleteGif = async (req, res) => {
  const gif = +req.params.gifId;
  const user = await getUserId(req);
  const gifToDelete = {
    gifId: gif,
    userId: user
  };
  try {
    const result = await GifService.deleteGif(gifToDelete);
    if (!result) {
      util.setError(400, 'Sorry, there was an error');
      return util.send(res);
    }
    if (result.length === 0) {
      util.setError(404, 'Sorry, Gif not found');
      return util.send(res);
    }
    const deleteOnCloudinary = await Helpers.deleteFromCloudinary(result.public_id);
    if (!deleteOnCloudinary) {
      util.setError(500, 'Sorry, could not delete file');
      return util.send(res);
    }
    util.setSuccess(200, {
      message: 'gif post successfully deleted',
      gifId: result.gifId,
      title: result.title,
      imageUrl: result.imageUrl,
      public_id: result.public_id,
      createdOn: result.createdOn,
      token: req.headers.authorization,
      userId: result.userId
    });
    return util.send(res);
  } catch (error) {
    util.setError(400, error);
    return util.send(res);
  }
};

exports.commentGif = async (req, res) => {
  const gifId = +req.params.gifId;
  const userId = await getUserId(req);
  const commentToAdd = {
    comment: req.body.comment,
    type: 'gif',
    typeId: gifId,
    userId
  };
  try {
    const rows = await GifService.commentGif(commentToAdd);
    if (!rows) {
      util.setError(500, 'Sorry, there was an error');
      return util.send(res);
    }
    const result = rows[0];
    util.setSuccess(201, {
      message: 'Comment successfully created',
      commentId: result.commentId,
      comment: result.comment,
      userId: result.userId,
      createdOn: result.createdOn,
      token: req.headers.authorization
    });
    return util.send(res);
  } catch (error) {
    util.setError(400, error);
    return util.send(res);
  }
};

exports.flagGif = async (req, res) => {
  const userId = await getUserId(req);
  const typeId = +req.params.gifId;
  const flagToAdd = {
    type: 'gif',
    typeId,
    userId
  };
  try {
    const result = await GifService.flagGif(flagToAdd);
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
