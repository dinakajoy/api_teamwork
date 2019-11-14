/* eslint-disable no-useless-catch */
const pool = require('../config/dbConfig');

class ArticleService {
  static async addArticle(newArticle) {
    try {
      const newArticleQuery = 'INSERT INTO articles ("title", "article", "articleImage", "userId") VALUES($1, $2, $3, $4) RETURNING *';
      const values = [`${newArticle.title}`, `${newArticle.article}`, `${newArticle.articleImage}`, `${newArticle.userId}`];
      const result = await pool.query(newArticleQuery, values);
      return result;
    } catch (error) {
      throw error;
    }
  }
}

module.exports = ArticleService;
