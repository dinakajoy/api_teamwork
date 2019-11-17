/* eslint-disable no-useless-catch */
const pool = require('../config/dbConfig');

class CommentService {
  static async flagComment(flagToAdd) {
    try {
      const res = await pool.query('SELECT "userId", type, "typeId" FROM flags WHERE "userId" = $1 AND "typeId" = $2 AND type = $3', [flagToAdd.userId, flagToAdd.typeId, flagToAdd.type]);
      const result = res.rows[0];
      if (result && result.type === 'comment') {
        await pool.query('DELETE FROM flags WHERE "userId" = $1 AND "typeId" = $2 AND type = $3', [flagToAdd.userId, flagToAdd.typeId, flagToAdd.type]);
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

module.exports = CommentService;
