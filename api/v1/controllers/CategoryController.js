const CategoryService = require('../services/CategoryService');
const Util = require('../utils/Utils');

const util = new Util();

exports.createCategory = async (req, res) => {
  try {
    const result = await CategoryService.createCategory(req.body.category);
    if (result.error) {
      util.setError(500, result.error);
      return util.send(res);
    }
    const rows = result[0];
    util.setSuccess(201, {
      message: 'Category successfully added',
      categoryId: rows.categoryId,
      category: rows.category
    });
    return util.send(res);
  } catch (error) {
    util.setError(500, error);
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
    if (result.length < 1) {
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
  const categoryId = +req.params.categoryId;
  try {
    const result = await CategoryService.getArticlesCategory(categoryId);
    if (result) {
      if (result[1].length < 1) {
        util.setSuccess(200, {
          categoryId: result[0].categoryId,
          category: result[0].category,
          article: 'No article added for this category',
          token: req.headers.authorization
        });
        return util.send(res);
      }
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
  const editCategory = {
    categoryId: req.params.categoryId,
    category: req.body.category
  };
  try {
    const result = await CategoryService.editCategory(editCategory);
    if (!result) {
      util.setError(404, 'Not Found');
      return util.send(res);
    }
    util.setSuccess(200, {
      message: 'Category updated successfully',
      categoryId: editCategory.categoryId,
      category: editCategory.category
    });
    return util.send(res);
  } catch (error) {
    util.setError(500, error);
    return util.send(res);
  }
};
