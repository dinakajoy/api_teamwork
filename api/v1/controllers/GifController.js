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
    check(file.name).isLength({ min: 3 }).isMimeType('image/gif'),
    check(req.body.title).isLength({ min: 3 })
  ];
  const errors = validationResult(validationData);
  if (!errors.isEmpty()) {
    util.setError(400, errors.msg);
    return util.send(res);
  }
  if (file.mimetype !== 'image/gif') {
    util.setError(400, 'Please upload a GIF file');
    return util.send(res);
  }
  const cloudGifUrl = await cloudinary.uploader.upload(file.tempFilePath, (error, result) => {
    if (error) {
      util.setError(400, error);
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
      gifId: result.rows[0].gifId,
      message: 'GIF image successfully posted',
      title: result.rows[0].title,
      imageUrl: result.rows[0].imageUrl,
      token: req.headers.authorization,
      userId: result.rows[0].userId,
      createdOn: result.rows[0].created_at
    });
    return util.send(res);
  } catch (error) {
    util.setError(400, error);
    return util.send(res);
  }
};
