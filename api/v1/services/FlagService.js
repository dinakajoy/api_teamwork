/* eslint-disable quotes */
/* eslint-disable no-useless-catch */
const pool = require('../config/dbConfig');

class FlagService {
  static async getFlags() {
    try {
      const getFlagsQuery = `SELECT 
                f."flagId", f.type, f."typeId", f."createdOn", a.title, concat(u."firstName", ' ', u."lastName") AS author 
                FROM flags f 
                INNER JOIN articles a ON f.type=$1 AND f."typeId"= a."articleId" 
                INNER JOIN users u ON f."userId"=u."userId"
                UNION
                SELECT 
                f."flagId", f.type, f."typeId", f."createdOn", g.title, concat(u."firstName", ' ', u."lastName") AS author 
                FROM flags f 
                INNER JOIN gifs g ON f.type=$2 AND f."typeId"= g."gifId" 
                INNER JOIN users u ON f."userId"=u."userId"
                UNION
                SELECT 
                f."flagId", f.type, f."typeId", f."createdOn" ,c.comment, concat(u."firstName", ' ', u."lastName") AS author 
                FROM flags f 
                INNER JOIN comments c ON f.type=$3 AND f."typeId"= c."commentId" 
                INNER JOIN users u ON f."userId"=u."userId"
                ORDER BY "createdOn" DESC`;
      const values = ['article', 'gif', 'comment'];
      const flaggedQuery = await pool.query(getFlagsQuery, values);
      const flagged = flaggedQuery.rows;
      return flagged;
    } catch (error) {
      throw error;
    }
  }

  static async getFlag(flagId) {
    try {
      const { rows } = await pool.query('SELECT "flagId", type, "typeId", "userId", "createdOn" FROM flags WHERE "flagId"=$1', [flagId]);
      if (rows.length === 0 || !rows) {
        return rows;
      }
      if (rows[0].type === 'article') {
        const result = await pool.query(`SELECT a."articleId", a.title, a."articleImage", c.category, a."createdOn", concat("firstName", ' ', "lastName") AS author FROM articles a INNER JOIN users u ON a."userId" = u."userId" INNER JOIN categories c ON a."categoryId" = c."categoryId" WHERE a."articleId"=$1`, [rows[0].typeId]);
        return result.rows[0];
      }
      if (rows[0].type === 'gif') {
        const result = await pool.query(`SELECT g."gifId", g.title, g."imageUrl", g.public_id, g."createdOn", concat("firstName", ' ', "lastName") AS author FROM gifs g INNER JOIN users u ON g."userId" = u."userId" WHERE g."gifId"=$1`, [rows[0].typeId]);
        return result.rows[0];
      }
      if (rows[0].type === 'comment') {
        const result = await pool.query(`SELECT c."commentId", c.comment, c."createdOn", concat("firstName", ' ', "lastName") AS author FROM comments c INNER JOIN users u ON c."userId" = u."userId" WHERE c."commentId"=$1`, [rows[0].typeId]);
        return result.rows[0];
      }
      return 'Sorry, there was an error';
    } catch (error) {
      throw error;
    }
  }

  static async deleteFlag(flagId) {
    try {
      const { rows } = await pool.query('SELECT "flagId", type, "typeId", "userId", "createdOn" FROM flags WHERE "flagId"=$1', [flagId]);
      if (rows.length === 0 || !rows) {
        return rows;
      }
      if (rows[0].type === 'article') {
        await pool.query('DELETE FROM articles WHERE articleId=$1', [rows[0].typeId]);
      }
      if (rows[0].type === 'gif') {
        await pool.query('DELETE FROM gifs WHERE "gifId"=$1', [rows[0].typeId]);
      }
      if (rows[0].type === 'comment') {
        await pool.query('DELETE FROM comments WHERE "commentId"=$1', [rows[0].typeId]);
      }
      await pool.query('DELETE FROM flags WHERE "flagId"=$1', [flagId]);
      return 'Successfully, deleted flagged item';
    } catch (error) {
      throw error;
    }
  }
}

module.exports = FlagService;
