const fs = require('fs');

const getUserId = require('../middleware/getUserIdMiddleware');
const ArticleService = require('../services/ArticleService');
const Util = require('../utils/Utils');

const util = new Util();

exports.createArticle = async (req, res) => {
  let newArticle;
  const userId = await getUserId(req);
  let result;
  if (req.files) {
    const file = req.files.articleImage;
    const mimetype = file.mimetype;
    let filetype;
    switch (mimetype) {
      case 'image/jpg':
        filetype = 'jpg';
        break;
      case 'image/jpeg':
        filetype = 'jpg';
        break;
      case 'image/png':
        filetype = 'png';
        break;
      default:
        filetype = '';
        break;
    }
    if (!filetype || filetype === '') {
      util.setError(422, 'Wrong file type');
      return util.send(res);
    }
    file.name.split(' ').join('');
    const url = `${req.protocol}://${req.get('host')}`;
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
    if (result[1].length === 0) {
      util.setSuccess(200, {
        articleId: result[0].articleId,
        title: result[0].title,
        articleImage: result[0].articleImage,
        article: result[0].article,
        category: result[0].category,
        author: result[0].author,
        createdOn: result[0].createdOn,
        comments: 'No comment added for this article',
        token: req.headers.authorization
      });
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
  let newArticle;
  const userId = await getUserId(req);
  let result;
  if (req.files) {
    const file = req.files.articleImage;
    const mimetype = file.mimetype;
    let filetype;
    switch (mimetype) {
      case 'image/jpg':
        filetype = 'jpg';
        break;
      case 'image/jpeg':
        filetype = 'jpg';
        break;
      case 'image/png':
        filetype = 'png';
        break;
      default:
        filetype = '';
        break;
    }
    if (!filetype || filetype === '') {
      util.setError(422, 'Wrong file type');
      return util.send(res);
    }
    file.name.split(' ').join('');
    const url = `${req.protocol}://${req.get('host')}`;
    const img = `/api/v1/images/articles/${Date.now()}_${file.name}`;
    file.mv(`.${img}`, (err) => {
      if (err) {
        util.setError(err.statusCode, 'Could Not Upload Image');
        return util.send(res);
      }
      return file;
    });
    newArticle = {
      articleId: +req.params.articleId,
      categoryId: +req.body.categoryId,
      title: req.body.title,
      article: req.body.article,
      articleImage: `${url}${img}`,
      userId
    };
    result = await ArticleService.editArticle(newArticle);
  } else {
    newArticle = {
      articleId: +req.params.articleId,
      categoryId: +req.body.categoryId,
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
      message: result[0],
      articleId: newArticle.articleId,
      title: newArticle.title,
      articleImage: result[1],
      token: req.headers.authorization
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
  try {
    const result = await ArticleService.deleteArticle(articleDetails);
    if (!result) {
      util.setError(400, 'Sorry, there was an error');
      return util.send(res);
    }
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
      util.setSuccess(200, {
        message: result[1],
        token: req.headers.authorization
      });
      return util.send(res);
    }
    util.setSuccess(200, {
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
