/* eslint-disable quotes */
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
      if (rows === [] || rows.length === 0) {
        return ['Article does not exist', 'Article does not exist'];
      }
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
      const { rows } = await pool.query('SELECT * from articles WHERE "articleId" = $1', [newArticle.articleId]);
      if (!rows[0]) {
        return 'Sorry, article was not found';
      }
      if (rows[0].userId === newArticle.userId) {
        const newArticleQuery = 'UPDATE articles SET "categoryId" = ($1), "title" = ($2), "article" = ($3), "articleImage" = ($4) WHERE "articleId" = ($5)';
        const values = [newArticle.categoryId, newArticle.title, newArticle.article, newArticle.articleImage, newArticle.articleId];
        await pool.query(newArticleQuery, values);
      }
      return ['Article successfully updated', newArticle.articleImage];
    } catch (error) {
      throw error;
    }
  }

  static async updateArticle(newArticle) {
    try {
      const { rows } = await pool.query('SELECT * from articles WHERE "articleId" = $1', [`${newArticle.articleId}`]);
      if (!rows) {
        return 'Sorry, article was not found';
      }
      if (rows[0].userId === newArticle.userId) {
        const newArticleQuery = 'UPDATE articles SET "categoryId" = ($1), "title" = ($2), "article" = ($3) WHERE "articleId" = ($4)';
        const values = [newArticle.categoryId, newArticle.title, newArticle.article, newArticle.articleId];
        await pool.query(newArticleQuery, values);
      }
      return ['Article successfully updated', rows[0].articleImage];
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
        const deleteArticleComments = await pool.query(`DELETE FROM comments WHERE type = 'article' AND "typeId" = ($1)`, [articleDetails.articleId]);

        const deleteArticleFlags = await pool.query(`DELETE FROM flags WHERE type = 'article' AND "typeId" = ($1)`, [articleDetails.articleId]);

        if (!deleteArticleComments || !deleteArticleFlags) {
          return 'Sorry, could not delete user';
        }
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
      const { rows } = await pool.query('SELECT * from articles WHERE "articleId" = $1', [commentToAdd.articleId]);
      if (!rows) {
        return 'Sorry, article not found';
      }
      if (rows[0]) {
        const newGifQuery = 'INSERT INTO comments ("comment", "type", "typeId", "userId") VALUES($1, $2, $3, $4) RETURNING *';
        const values = [`${commentToAdd.comment}`, `${commentToAdd.type}`, `${commentToAdd.articleId}`, `${commentToAdd.userId}`];
        await pool.query(newGifQuery, values);
      }
      return rows[0];
    } catch (error) {
      throw error;
    }
  }

  static async flagArticle(flagToAdd) {
    try {
      const res = await pool.query('SELECT "userId", type, "typeId" FROM flags WHERE ("userId" = $1 AND "typeId" = $2) AND type = $3', [flagToAdd.userId, flagToAdd.typeId, flagToAdd.type]);
      const result = res.rows[0];
      if (result && result.type === 'article') {
        await pool.query('DELETE FROM flags WHERE ("userId" = $1 AND "typeId" = $2) AND type = $3', [flagToAdd.userId, flagToAdd.typeId, flagToAdd.type]);
        return ['true', 'Successfully unflagged article as inappropriate'];
      }
      const flagQuery = 'INSERT INTO flags ("userId", "type", "typeId") VALUES($1, $2, $3) RETURNING *';
      const values = [`${flagToAdd.userId}`, `${flagToAdd.type}`, `${flagToAdd.typeId}`];
      const { rows } = await pool.query(flagQuery, values);
      return ['false', rows[0]];
    } catch (error) {
      throw error;
    }
  }
}

module.exports = ArticleService;
