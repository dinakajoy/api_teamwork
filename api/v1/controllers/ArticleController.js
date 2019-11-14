const { check, validationResult } = require('express-validator');

const getUserId = require('../middleware/getUserIdMiddleware');
const ArticleService = require('../services/ArticleService');
const Util = require('../utils/Utils');

const util = new Util();

exports.createArticle = async (req, res) => {
  const file = req.files.articleImage;
  const url = `${req.protocol}://${req.get('host')}`;
  console.log(url);
  const validationData = [
    check(req.body.title).isLength({ min: 3 }),
    check(req.body.article).isLength({ min: 20 })
  ];
  const errors = validationResult(validationData);
  if (!errors.isEmpty()) {
    util.setError(422, errors.msg);
    return util.send(res);
  }
  const userId = await getUserId(req);
  const newArticle = {
    title: req.body.title,
    article: req.body.article,
    articleImage: `${url}/api/v1/images/articles/${Date.now()}_${file.name}.jpg`,
    userId
  };
  try {
    file.mv(`./api/v1/images/articles/${Date.now()}_$file.name}.jpg`, (err) => {
      if (err) {
        util.setError(err.statusCode, 'Could Not Upload Image');
        return util.send(res);
      }
      return file;
    });
    const result = await ArticleService.addArticle(newArticle);
    util.setSuccess(201, {
      message: 'Article successfully posted',
      ArticleId: result.rows[0].ArticleId,
      title: result.rows[0].title,
      articleImage: result.rows[0].articleImage,
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
