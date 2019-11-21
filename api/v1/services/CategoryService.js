/* eslint-disable no-useless-catch */
const pool = require('../config/dbConfig');

class CategoryService {
  static async createCategory(newCategory) {
    try {
      const newCategoryQuery = 'INSERT INTO categories ("category") VALUES($1) RETURNING *';
      const values = [`${newCategory.category}`];
      const { rows } = await pool.query(newCategoryQuery, values);
      return rows[0];
    } catch (error) {
      throw error;
    }
  }

  static async getCategories() {
    try {
      const getCategoriesQuery = 'SELECT "categoryId", category FROM categories';
      const { rows } = await pool.query(getCategoriesQuery);
      return rows;
    } catch (error) {
      throw error;
    }
  }

  static async getArticleCategory(categoryId) {
    try {
      const getCategoryQuery = 'SELECT "categoryId", category FROM categories WHERE "categoryId" = $1';
      const getArticleQuery = `SELECT a."articleId", a.title, a."articleImage", a.article, a."createdOn", concat(u."firstName", ' ', u."lastName") AS author 
      FROM articles a
      INNER JOIN users u ON a."userId" = u."userId" 
      WHERE a."categoryId" = $1`;
      const values = [categoryId];
      const { rows } = await pool.query(getCategoryQuery, values);
      const res = await pool.query(getArticleQuery, values);
      const category = rows[0];
      const article = res.rows;
      return [category, article];
    } catch (error) {
      throw error;
    }
  }

  static async editCategory(categoryDetails) {
    try {
      const editCategoryQuery = 'UPDATE categories SET "category" = ($1) WHERE "categoryId" = ($2)';
      const values = [`${categoryDetails.category}`, `${categoryDetails.categoryId}`];
      const result = await pool.query(editCategoryQuery, values);
      return result;
    } catch (error) {
      throw error;
    }
  }
}

module.exports = CategoryService;
