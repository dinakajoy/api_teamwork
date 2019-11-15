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
    categoryId: req.body.categoryId,
    title: req.body.title,
    article: req.body.article,
    articleImage: `${url}/api/v1/images/articles/${Date.now()}_${file.name}`,
    userId
  };
  try {
    const result = await ArticleService.createArticle(newArticle);
    if (!result) {
      util.setError(500, 'Sorry, there was an error');
      return util.send(res);
    }
    file.mv(`./api/v1/images/articles/${Date.now()}_$file.name}.jpg`, (err) => {
      if (err) {
        util.setError(err.statusCode, 'Could Not Upload Image');
        return util.send(res);
      }
      return file;
    });
    util.setSuccess(201, {
      message: 'Article successfully posted',
      articleId: result.articleId,
      title: result.title,
      articleImage: result.articleImage,
      token: req.headers.authorization,
      userId: result.userId,
      createdOn: result.createdOn
    });
    return util.send(res);
  } catch (error) {
    util.setError(400, error);
    return util.send(res);
  }
};

exports.editArticle = async (req, res) => {
  const validationData = [
    check(req.body.title).isLength({ min: 3 }),
    check(req.body.article).isLength({ min: 20 })
  ];
  const errors = validationResult(validationData);
  if (!errors.isEmpty()) {
    util.setError(422, errors.msg);
    return util.send(res);
  }
  let file;
  let url;
  let newArticle;
  const userId = await getUserId(req);
  let result;
  if (req.file) {
    file = req.files.articleImage;
    url = `${req.protocol}://${req.get('host')}`;
    file.mv(`./api/v1/images/articles/${Date.now()}_$file.name}.jpg`, (err) => {
      if (err) {
        util.setError(err.statusCode, 'Could Not Upload Image');
        return util.send(res);
      }
      return file;
    });
    newArticle = {
      articleId: req.params.articleId,
      categoryId: req.body.categoryId,
      title: req.body.title,
      article: req.body.article,
      articleImage: `${url}/api/v1/images/articles/${Date.now()}_${file.name}.jpg`,
      userId
    };
    result = await ArticleService.editArticle(newArticle);
  } else {
    newArticle = {
      articleId: req.params.articleId,
      categoryId: req.body.categoryId,
      title: req.body.title,
      article: req.body.article,
      userId
    };
    result = await ArticleService.updateArticle(newArticle);
  }
  try {
    if (!result) {
      util.setError(400, 'Sorry, there was an error');
      return util.send(res);
    }
    util.setSuccess(201, {
      message: 'Article successfully updated',
      ArticleId: result.ArticleId,
      title: result.title,
      articleImage: result.articleImage,
      token: req.headers.authorization,
      createdOn: result.createdOn
    });
    return util.send(res);
  } catch (error) {
    util.setError(400, error);
    return util.send(res);
  }
};
