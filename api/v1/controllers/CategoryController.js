const { check, validationResult } = require('express-validator');

const CategoryService = require('../services/CategoryService');
const Util = require('../utils/Utils');

const util = new Util();

exports.createCategory = async (req, res) => {
  const validationData = [
    check(req.body.category).isLength({ min: 3 })
  ];
  const errors = validationResult(validationData);
  if (!errors.isEmpty()) {
    util.setError(422, errors.msg);
    return util.send(res);
  }
  console.log(req.body.category);
  try {
    const result = await CategoryService.createCategory(req.body.category);
    util.setSuccess(201, {
      message: 'Category successfully added',
      categoryId: result.categoryId,
      category: result.category
    });
    return util.send(res);
  } catch (error) {
    util.setError(400, error);
    return util.send(res);
  }
};

exports.getCategory = async (req, res) => {
  const categoryId = req.params.categoryId;
  try {
    const result = await CategoryService.getCategory(categoryId);
    if (result) {
      util.setSuccess(200, {
        categoryId: result.categoryId,
        category: result.category
      });
      return util.send(res);
    }
    util.setError(404, 'Not Found');
    return util.send(res);
  } catch (error) {
    util.setError(400, error);
    return util.send(res);
  }
};

exports.getCategories = async (req, res) => {
  try {
    const result = await CategoryService.getCategories();
    if (!result) {
      util.setError(500, 'Sorry, there was an error');
      return util.send(res);
    }
    if (result < 1) {
      util.setSuccess(200, {
        message: 'No Category Added'
      });
      return util.send(res);
    }
    util.setSuccess(200, result);
    return util.send(res);
  } catch (error) {
    util.setError(400, error);
    return util.send(res);
  }
};

exports.getArticleCategory = async (req, res) => {
  const categoryId = req.params.categoryId;
  try {
    const result = await CategoryService.getArticleCategory(categoryId);
    if (result) {
      util.setSuccess(200, {
        categoryId: result[0].categoryId,
        category: result[0].category,
        article: result[1],
        token: req.headers.authorization
      });
      return util.send(res);
    }
    util.setError(404, 'Not Found');
    return util.send(res);
  } catch (error) {
    util.setError(400, error);
    return util.send(res);
  }
};

exports.editCategory = async (req, res) => {
  const validationData = [
    check(req.body.category).isLength({ min: 3 })
  ];
  const errors = validationResult(validationData);
  if (!errors.isEmpty()) {
    util.setError(422, errors.msg);
    return util.send(res);
  }
  const editCategory = {
    category: req.body.category,
    categoryId: req.params.categoryId
  };

  try {
    const result = await CategoryService.editCategory(editCategory);
    if (!result) {
      util.setError(400, 'Not Found');
      return util.send(res);
    }
    util.setSuccess(200, {
      message: 'Category updated successfully'
    });
    return util.send(res);
  } catch (error) {
    util.setError(500, error);
    return util.send(res);
  }
};

exports.deleteCategory = async (req, res) => {
  const categoryId = req.params.categoryId;
  try {
    const result = await CategoryService.deleteCategory(categoryId);
    if (!result) {
      util.setError(400, 'Not Found');
      return util.send(res);
    }
    util.setSuccess(200, {
      message: 'Category deleted successfully'
    });
    return util.send(res);
  } catch (error) {
    util.setError(400, error);
    return util.send(res);
  }
};
