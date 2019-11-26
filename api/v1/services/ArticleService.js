const query = require('../config/queryConfig');
const commentService = require('../services/CommentService');
const flagService = require('../services/FlagService');

class ArticleService {
  static async createArticle(newArticle) {
    const newArticleQuery = 'INSERT INTO articles ("categoryId", "title", "article", "userId") VALUES($1, $2, $3, $4) RETURNING *';
    const values = [`${newArticle.categoryId}`, `${newArticle.title}`, `${newArticle.article}`, `${newArticle.userId}`];
    try {
      const category = await query.queryResult(newArticleQuery, values);
      return category;
    } catch (error) {
      return error;
    }
  }

  static async createArticleWithImage(newArticle) {
    const newArticleQuery = 'INSERT INTO articles ("categoryId", "title", "article", "articleImage", "userId") VALUES($1, $2, $3, $4, $5) RETURNING *';
    const values = [`${newArticle.categoryId}`, `${newArticle.title}`, `${newArticle.article}`, `${newArticle.articleImage}`, `${newArticle.userId}`];
    try {
      const category = await query.queryResult(newArticleQuery, values);
      return category;
    } catch (error) {
      return error;
    }
  }

  static async getArticlesCategory(categoryId) {
    const getArticles = `SELECT
            a."articleId", a.title, a."articleImage", a.article, a."createdOn", c.category, concat("firstName", ' ', "lastName") AS author
            FROM articles a
            INNER JOIN users u ON a."userId" = u."userId"
            INNER JOIN categories c ON a."categoryId" = c."categoryId"
            WHERE a."categoryId" = $1`;
    const values = [categoryId];
    try {
      const category = await query.queryResult(getArticles, values);
      return category;
    } catch (error) {
      return error;
    }
  }

  static async getArticle(articleId) {
    const getArticleQuery = `SELECT
              a."articleId", a.title, a."articleImage", a.article, a."createdOn", c.category, concat("firstName", ' ', "lastName") AS author
              FROM articles a
              INNER JOIN users u ON a."userId" = u."userId"
              INNER JOIN categories c ON a."categoryId" = c."categoryId"
              WHERE "articleId" = $1`;
    const values = [articleId];
    const getArticle = await query.queryResult(getArticleQuery, values);
    if (getArticle.length < 1) {
      return !getArticle;
    }
    try {
      const comments = await commentService.getComments('article', articleId);
      const flags = await flagService.getFlaggedItem('article', articleId);
      return [getArticle, comments, flags];
    } catch (error) {
      return error;
    }
  }

  static async editArticleWithImage(newArticle) {
    const rows = await query.queryResult('SELECT * from articles WHERE "articleId" = $1', [newArticle.articleId]);
    if (!rows || rows.length < 1) {
      return !rows;
    }
    const result = rows[0];
    if (result.userId === newArticle.userId) {
      const newArticleQuery = 'UPDATE articles SET "categoryId" = ($1), "title" = ($2), "article" = ($3), "articleImage" = ($4) WHERE "articleId" = ($5)';
      const values = [newArticle.categoryId, newArticle.title, newArticle.article, newArticle.articleImage, newArticle.articleId];
      const EditArticleResult = await query.updateQueryResult(newArticleQuery, values);
      if (EditArticleResult === 'Successful') {
        return rows;
      }
      return !EditArticleResult;
    }
    return ['Not authorized'];
  }

  static async editArticle(newArticle) {
    const rows = await query.queryResult('SELECT * from articles WHERE "articleId" = $1', [newArticle.articleId]);
    if (!rows || rows.length < 1) {
      return !rows;
    }
    const result = rows[0];
    if (result.userId === newArticle.userId) {
      const newArticleQuery = 'UPDATE articles SET "categoryId" = ($1), "title" = ($2), "article" = ($3) WHERE "articleId" = ($4)';
      const values = [newArticle.categoryId, newArticle.title, newArticle.article, newArticle.articleId];
      const EditArticleResult = await query.updateQueryResult(newArticleQuery, values);
      if (EditArticleResult === 'Successful') {
        return rows;
      }
      return !EditArticleResult;
    }
    return ['Not authorized'];
  }

  static async deleteArticle(articleDetails) {
    const rows = await query.queryResult(`SELECT * from articles WHERE "articleId" = ${articleDetails.articleId}`);
    if (!rows || rows.length < 1) {
      return !rows;
    }
    const result = rows[0];
    if (result.userId === articleDetails.userId) {
      const deleteDetails = { type: 'article', typeId: articleDetails.articleId };
      await commentService.deleteCommentByItem(deleteDetails);
      await flagService.deleteFlagByItem(deleteDetails);

      const newArticleQuery = 'DELETE FROM articles WHERE "articleId" = ($1)';
      const values = [`${articleDetails.articleId}`];
      const deleteArticleResult = await query.updateQueryResult(newArticleQuery, values);
      if (deleteArticleResult === 'Successful') {
        return rows;
      }
      return !deleteArticleResult;
    }
    return ['Not authorized'];
  }

  // Delete all users article when user is deleted
  static async deleteUserArticle(userId) {
    const rows = await query.queryResult('SELECT * from articles WHERE "userId" = $1', [userId]);
    if (!rows || rows.length < 1) {
      return !rows;
    }
    const deleteDetails = { type: 'article', typeId: rows[0].articleId };
    await commentService.deleteCommentByItem(deleteDetails);
    await flagService.deleteFlagByItem(deleteDetails);

    const newArticleQuery = 'DELETE FROM articles WHERE "userId" = ($1)';
    const values = [userId];
    const deleteArticleResult = await query.updateQueryResult(newArticleQuery, values);
    if (deleteArticleResult === 'Successful') {
      return rows;
    }
    return !deleteArticleResult;
  }

  static async commentArticle(commentToAdd) {
    const rows = await query.queryResult('SELECT * from articles WHERE "articleId" = $1', [commentToAdd.articleId]);
    if (!rows) {
      return 'Sorry, article not found';
    }
    const result = await commentService.createComment(commentToAdd);
    return result;
  }

  static async flagArticle(flagToAdd) {
    const rows = await query.queryResult('SELECT * from articles WHERE "articleId" = $1', [flagToAdd.typeId]);
    if (!rows) {
      return 'Sorry, article not found';
    }
    const result = await flagService.createFlag(flagToAdd);
    return result.message;
  }
}

module.exports = ArticleService;
