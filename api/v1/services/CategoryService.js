/* eslint-disable no-useless-catch */
const pool = require('../config/dbConfig');

class CategoryService {
  static async createCategory(newCategory) {
    try {
      const newCategoryQuery = 'INSERT INTO categories ("category") VALUES($1) RETURNING *';
      const values = [newCategory];
      const { rows } = await pool.query(newCategoryQuery, values);
      return rows[0];
    } catch (error) {
      throw error;
    }
  }

  static async getCategory(categoryId) {
    try {
      const getCategoryQuery = 'SELECT * FROM categories WHERE "categoryId" = $1';
      const values = [categoryId];
      const { rows } = await pool.query(getCategoryQuery, values);
      return rows[0];
    } catch (error) {
      throw error;
    }
  }

  static async getCategories() {
    try {
      const getCategoriesQuery = 'SELECT * FROM categories';
      const { rows } = await pool.query(getCategoriesQuery);
      return rows;
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

  static async deleteCategory(categoryId) {
    try {
      const deleteCategoryQuery = 'DELETE FROM categories WHERE "categoryId" = ($1)';
      const values = [categoryId];
      const result = await pool.query(deleteCategoryQuery, values);
      return result;
    } catch (error) {
      throw error;
    }
  }
}

module.exports = CategoryService;
