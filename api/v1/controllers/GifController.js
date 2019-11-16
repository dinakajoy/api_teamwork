const { check, validationResult } = require('express-validator');
const cloudinary = require('cloudinary').v2;
require('dotenv').config();

const getUserId = require('../middleware/getUserIdMiddleware');
const GifService = require('../services/GifService');
const Util = require('../utils/Utils');

const util = new Util();

cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.API_KEY,
  api_secret: process.env.API_SECRET,
});

exports.createGif = async (req, res) => {
  const file = req.files.gif;
  const validationData = [
    check(req.body.title).isLength({ min: 3 })
  ];
  const errors = validationResult(validationData);
  if (!errors.isEmpty()) {
    util.setError(422, errors.msg);
    return util.send(res);
  }
  if (file.mimetype !== 'image/gif') {
    util.setError(415, 'Please upload a GIF file');
    return util.send(res);
  }
  const cloudGifUrl = await cloudinary.uploader.upload(file.tempFilePath, (error, result) => {
    if (error) {
      util.setError(500, error);
      return util.send(res);
    }
    return result;
  });
  const userId = await getUserId(req);
  const newGif = {
    title: req.body.title,
    imageUrl: cloudGifUrl.secure_url,
    public_id: cloudGifUrl.public_id,
    userId
  };
  try {
    const result = await GifService.addGif(newGif);
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
    const result = await GifService.getGif(gifId);
    if (!result) {
      util.setError(400, 'Sorry, there was an error');
      return util.send(res);
    }
    util.setSuccess(200, {
      gifId: result[0].gifId,
      title: result[0].title,
      imageUrl: result[0].imageUrl,
      public_id: result[0].public_id,
      createdOn: result[0].createdOn,
      author: result[0].author,
      comments: result[1],
      token: req.headers.authorization
    });
    return util.send(res);
  } catch (error) {
    util.setError(400, error);
    return util.send(res);
  }
};

exports.deleteGif = async (req, res) => {
  const gifId = +req.params.gifId;
  const userId = await getUserId(req);
  const gifToDelete = { gifId, userId };
  const result = await GifService.deleteGif(gifToDelete);
  await cloudinary.uploader.destroy(result.public_id, (error, success) => {
    if (error) {
      util.setError(500, 'Sorry, could not delete file');
      return util.send(res);
    }
    return success;
  });
  try {
    if (!result) {
      util.setError(400, 'Sorry, there was an error');
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
  const validationData = [
    check(req.body.comment).isLength({ min: 3 })
  ];
  const errors = validationResult(validationData);
  if (!errors.isEmpty()) {
    util.setError(422, errors.msg);
    return util.send(res);
  }
  const gifId = +req.params.gifId;
  const userId = await getUserId(req);
  const commentToAdd = {
    comment: req.body.comment,
    type: 'gif',
    gifId,
    userId
  };
  try {
    const result = await GifService.commentGif(commentToAdd);
    if (!result) {
      util.setError(400, 'Sorry, there was an error');
      return util.send(res);
    }
    util.setSuccess(201, {
      message: 'comment successfully created',
      commentId: result.commentId,
      gifId: result.gifId,
      title: result.title,
      imageUrl: result.imageUrl,
      public_id: result.public_id,
      createdOn: result.createdOn,
      token: req.headers.authorization,
      comment: result.comment,
      userId: result.userId
    });
    return util.send(res);
  } catch (error) {
    util.setError(400, error);
    return util.send(res);
  }
};
