const query = require('../config/queryConfig');
const articleService = require('../services/ArticleService');

class CategoryService {
  static async createCategory(newCategory) {
    const newCategoryQuery = 'INSERT INTO categories ("category") VALUES($1) RETURNING *';
    const values = [newCategory];
    try {
      const result = await query.queryResult(newCategoryQuery, values);
      return result;
    } catch (error) {
      return error;
    }
  }

  static async getCategories() {
    const getCategoriesQuery = 'SELECT "categoryId", category FROM categories';
    try {
      const result = await query.queryResult(getCategoriesQuery);
      return result;
    } catch (error) {
      return error;
    }
  }

  static async getCategory(categoryId) {
    const getCategory = 'SELECT "categoryId", category FROM categories WHERE "categoryId" = $1';
    const values = [categoryId];
    try {
      const result = await query.queryResult(getCategory, values);
      return result;
    } catch (error) {
      return error;
    }
  }

  static async getArticlesCategory(categoryId) {
    try {
      const category = await CategoryService.getCategory(categoryId);
      const articles = await articleService.getArticlesCategory(categoryId);
      return [category[0], articles];
    } catch (error) {
      return error;
    }
  }

  static async editCategory(categoryDetails) {
    const getCategory = await query.queryResult('SELECT "categoryId", "category" FROM categories WHERE "categoryId" = $1', [categoryDetails.categoryId]);
    if (getCategory.length < 1) {
      return !getCategory;
    }
    const editCategoryQuery = 'UPDATE categories SET "category" = ($1) WHERE "categoryId" = ($2)';
    const values = [`${categoryDetails.category}`, `${categoryDetails.categoryId}`];
    const result = await query.updateQueryResult(editCategoryQuery, values);
    if (result === 'Successful') {
      return getCategory;
    }
    return !result;
  }
}

module.exports = CategoryService;
