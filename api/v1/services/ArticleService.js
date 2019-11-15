/* eslint-disable no-useless-catch */
const pool = require('../config/dbConfig');

class ArticleService {
  static async createArticle(newArticle) {
    try {
      const newArticleQuery = 'INSERT INTO articles ("categoryId", "title", "article", "articleImage", "userId") VALUES($1, $2, $3, $4, $5) RETURNING *';
      const values = [`${newArticle.categoryId}`, `${newArticle.title}`, `${newArticle.article}`, `${newArticle.articleImage}`, `${newArticle.userId}`];
      const { rows } = await pool.query(newArticleQuery, values);
      return rows[0];
    } catch (error) {
      throw error;
    }
  }
}

module.exports = ArticleService;
