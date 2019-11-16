/* eslint-disable no-useless-catch */
const pool = require('../config/dbConfig');

class ArticleService {
  static async createArticle(newArticle) {
    try {
      const newArticleQuery = 'INSERT INTO articles ("categoryId", "title", "article", "userId") VALUES($1, $2, $3, $4) RETURNING *';
      const values = [`${newArticle.categoryId}`, `${newArticle.title}`, `${newArticle.article}`, `${newArticle.userId}`];
      const { rows } = await pool.query(newArticleQuery, values);
      return rows[0];
    } catch (error) {
      throw error;
    }
  }

  static async createArticleWithImage(newArticle) {
    try {
      const newArticleQuery = 'INSERT INTO articles ("categoryId", "title", "article", "articleImage", "userId") VALUES($1, $2, $3, $4, $5) RETURNING *';
      const values = [`${newArticle.categoryId}`, `${newArticle.title}`, `${newArticle.article}`, `${newArticle.articleImage}`, `${newArticle.userId}`];
      const { rows } = await pool.query(newArticleQuery, values);
      return rows[0];
    } catch (error) {
      throw error;
    }
  }

  static async getArticle(articleDetails) {
    try {
      const getArticleQuery = `SELECT 
              a."articleId", a.title, a."articleImage", a.article, a."createdOn", c.category, concat("firstName", ' ', "lastName") AS author
              FROM articles a 
              INNER JOIN users u ON a."userId" = u."userId" 
              INNER JOIN categories c ON a."categoryId" = c."categoryId" 
              WHERE "articleId" = $1`;
      const getArticleComment = `SELECT 
              c."commentId", c.comment, concat("firstName", ' ', "lastName") AS author 
              FROM comments c
              INNER JOIN users u ON c."userId" = u."userId"
              WHERE type = 'article' AND "typeId" = $1
              ORDER BY c."createdOn" DESC`;
      const values = [articleDetails];
      const { rows } = await pool.query(getArticleQuery, values);
      const res = await pool.query(getArticleComment, values);
      const article = rows[0];
      const comment = res.rows;
      return [article, comment];
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
      return rows[0];
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
      return rows[0];
    } catch (error) {
      throw error;
    }
  }

  static async deleteArticle(articleDetails) {
    try {
      let deleted = [];
      const { rows } = await pool.query(`SELECT * from articles WHERE "articleId" = ${articleDetails.articleId}`);
      if (!rows) {
        return 'Sorry, article was not found';
      }
      deleted = rows[0];
      if (deleted.userId === articleDetails.userId) {
        const newArticleQuery = 'DELETE FROM articles WHERE "articleId" = ($1)';
        const values = [`${articleDetails.articleId}`];
        await pool.query(newArticleQuery, values);
        return deleted;
      }
      return rows[0];
    } catch (error) {
      throw error;
    }
  }

  static async commentArticle(commentToAdd) {
    try {
      let deleted = [];
      const { rows } = await pool.query('SELECT * from articles WHERE "articleId" = $1', [commentToAdd.articleId]);
      if (!rows) {
        return 'Sorry, article not found';
      }
      deleted = rows[0];
      console.log(deleted);
      if (rows[0]) {
        const newGifQuery = 'INSERT INTO comments ("comment", "type", "typeId", "userId") VALUES($1, $2, $3, $4) RETURNING *';
        const values = [`${commentToAdd.comment}`, `${commentToAdd.type}`, `${commentToAdd.articleId}`, `${commentToAdd.userId}`];
        const result = await pool.query(newGifQuery, values);
        const res = result.rows[0];
        console.log(res, deleted);
      }
      return rows[0];
    } catch (error) {
      throw error;
    }
  }
}

module.exports = ArticleService;
