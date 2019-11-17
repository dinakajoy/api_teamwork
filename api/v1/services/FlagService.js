/* eslint-disable no-useless-catch */
const pool = require('../config/dbConfig');

class FlagService {
  static async getFlags() {
    try {
      const getFlagsQuery = `SELECT 
                f."flagId", f.type, f."createdOn", a.title, concat(u."firstName", ' ', u."lastName") AS author 
                FROM flags f 
                INNER JOIN articles a ON f.type=$1 AND f."typeId"= a."articleId" 
                INNER JOIN users u ON f."userId"=u."userId"
                UNION
                SELECT 
                f."flagId", f.type, f."createdOn", g.title, concat(u."firstName", ' ', u."lastName") AS author 
                FROM flags f 
                INNER JOIN gifs g ON f.type=$2 AND f."typeId"= g."gifId" 
                INNER JOIN users u ON f."userId"=u."userId"
                UNION
                SELECT 
                f."flagId", f.type, f."createdOn" ,c.comment, concat(u."firstName", ' ', u."lastName") AS author 
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
}

module.exports = FlagService;
