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

  static async editArticle(newArticle) {
    try {
      const { rows } = pool.query('SELECT * from articles WHERE "articleId" = $1', [newArticle.articleId]);
      if (!rows[0]) {
        return 'Sorry, article was not found';
      }
      if (rows[0].userId === newArticle.userId) {
        const newArticleQuery = 'UPDATE articles SET "categoryId" = ($1), "title" = ($2), "article" = ($3), "articleImage" = ($4) WHERE "articleId" = ($5)';
        const values = [`${newArticle.categoryId}`, `${newArticle.title}`, `${newArticle.article}`, `${newArticle.articleImage}`, `${newArticle.articleId}`];
        const result = await pool.query(newArticleQuery, values);
        return result.rows[0];
      }
      return 'Unauthorized user';
    } catch (error) {
      throw error;
    }
  }

  static async updateArticle(newArticle) {
    try {
      const { rows } = pool.query('SELECT * from articles WHERE "articleId" = $1', [newArticle.articleId]);
      if (!rows) {
        return 'Sorry, article was not found';
      }
      if (rows[0].userId === newArticle.userId) {
        const newArticleQuery = 'UPDATE articles SET "categoryId" = ($1), "title" = ($2), "article" = ($3) WHERE "articleId" = ($4)';
        const values = [`${newArticle.categoryId}`, `${newArticle.title}`, `${newArticle.article}`, `${newArticle.articleId}`];
        const result = await pool.query(newArticleQuery, values);
        return result.rows[0];
      }
      return 'Unauthorized user';
    } catch (error) {
      throw error;
    }
  }
}

module.exports = ArticleService;
