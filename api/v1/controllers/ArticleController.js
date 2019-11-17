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

exports.getArticle = async (req, res) => {
  const article = req.params.articleId;
  try {
    const result = await ArticleService.getArticle(article);
    if (!result) {
      util.setError(400, 'Sorry, there was an error');
      return util.send(res);
    }
    util.setSuccess(200, {
      articleId: result[0].articleId,
      title: result[0].title,
      articleImage: result[0].articleImage,
      article: result[0].article,
      category: result[0].category,
      author: result[0].author,
      createdOn: result[0].createdOn,
      comments: result[1],
      token: req.headers.authorization
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

exports.commentArticle = async (req, res) => {
  const validationData = [
    check(req.body.comment).isLength({ min: 3 })
  ];
  const errors = validationResult(validationData);
  if (!errors.isEmpty()) {
    util.setError(422, errors.msg);
    return util.send(res);
  }
  const userId = await getUserId(req);
  const commentToAdd = {
    comment: req.body.comment,
    type: 'article',
    articleId: +req.params.articleId,
    userId
  };
  try {
    const result = await ArticleService.commentArticle(commentToAdd);
    if (!result) {
      util.setError(400, 'Sorry, there was an error');
      return util.send(res);
    }
    util.setSuccess(201, {
      message: 'Comment successfully created',
      articleId: result.articleId,
      title: result.title,
      articleImage: result.articleImage,
      token: req.headers.authorization,
      userId: result.userId,
      createdOn: result.createdOn,
      commentId: result.commentId,
      comment: result.comment
    });
    return util.send(res);
  } catch (error) {
    util.setError(400, error);
    return util.send(res);
  }
};

exports.flagArticle = async (req, res) => {
  const userId = await getUserId(req);
  const typeId = +req.params.articleId;
  const flagToAdd = {
    type: 'article',
    typeId,
    userId
  };
  try {
    const result = await ArticleService.flagArticle(flagToAdd);
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
      message: 'Article successfully flagged as inappropriate',
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
