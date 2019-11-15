const { check, validationResult } = require('express-validator');
const fs = require('fs');

const getUserId = require('../middleware/getUserIdMiddleware');
const ArticleService = require('../services/ArticleService');
const Util = require('../utils/Utils');

const util = new Util();

exports.createArticle = async (req, res) => {
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
  if (req.files) {
    file = req.files.articleImage;
    url = `${req.protocol}://${req.get('host')}`;
    const img = `/api/v1/images/articles/${Date.now()}_${file.name}`;
    file.mv(`.${img}`, (err) => {
      if (err) {
        util.setError(err.statusCode, 'Could Not Upload Image');
        return util.send(res);
      }
      return file;
    });
    newArticle = {
      categoryId: req.body.categoryId,
      title: req.body.title,
      article: req.body.article,
      articleImage: `${url}${img}`,
      userId
    };
    result = await ArticleService.createArticleWithImage(newArticle);
  } else {
    newArticle = {
      categoryId: req.body.categoryId,
      title: req.body.title,
      article: req.body.article,
      userId
    };
    result = await ArticleService.createArticle(newArticle);
    console.log('No');
  }
  try {
    if (!result) {
      util.setError(500, 'Sorry, there was an error');
      return util.send(res);
    }
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
  if (req.files) {
    file = req.files.articleImage;
    url = `${req.protocol}://${req.get('host')}`;
    const img = `/api/v1/images/articles/${Date.now()}_${file.name}`;
    file.mv(`.${img}`, (err) => {
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
      articleImage: `${url}${img}`,
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
    util.setSuccess(200, {
      message: 'Article successfully updated',
      articleId: result.articleId,
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

exports.deleteArticle = async (req, res) => {
  const userId = await getUserId(req);
  const articleDetails = {
    articleId: +req.params.articleId,
    userId
  };
  const result = await ArticleService.deleteArticle(articleDetails);

  const filePath = `${result.articleImage}`;
  if (filePath !== 'poster.jpg') {
    const path = filePath.split('/');
    const mainFilePath = `./api/v1/images/articles/${path[7]}`;
    fs.unlink(mainFilePath, (err) => {
      if (err) {
        util.setError(400, 'Could not remove file');
        return util.send(res);
      }
      return 'success';
    });
  }
  try {
    if (!result) {
      util.setError(400, 'Sorry, there was an error');
      return util.send(res);
    }
    util.setSuccess(200, {
      message: 'Article successfully deleted',
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
