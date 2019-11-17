/* eslint-disable no-useless-catch */
const pool = require('../config/dbConfig');

class GifService {
  static async addGif(newGif) {
    try {
      const newGifQuery = 'INSERT INTO gifs ("title", "imageUrl", "public_id", "userId") VALUES($1, $2, $3, $4) RETURNING *';
      const values = [`${newGif.title}`, `${newGif.imageUrl}`, `${newGif.public_id}`, `${newGif.userId}`];
      const { rows } = await pool.query(newGifQuery, values);
      return rows[0];
    } catch (error) {
      throw error;
    }
  }

  static async getGif(gifId) {
    try {
      const getGifQuery = `SELECT 
              g."gifId", g.title, g."imageUrl", g.public_id, g."createdOn", concat("firstName", ' ', "lastName") AS author
              FROM gifs g 
              INNER JOIN users u ON g."userId" = u."userId"  
              WHERE "gifId" = $1`;
      const getGifComment = `SELECT 
              c."commentId", c.comment, concat("firstName", ' ', "lastName") AS author 
              FROM comments c
              INNER JOIN users u ON c."userId" = u."userId"
              WHERE type = 'gif' AND "typeId" = $1
              ORDER BY c."createdOn" DESC`;
      const values = [gifId];
      const { rows } = await pool.query(getGifQuery, values);
      const res = await pool.query(getGifComment, values);
      const gif = rows[0];
      const comment = res.rows;
      return [gif, comment];
    } catch (error) {
      throw error;
    }
  }

  static async deleteGif(gifToDelete) {
    try {
      let deleted = [];
      const { rows } = await pool.query('SELECT * from gifs WHERE "gifId" = $1', [gifToDelete.gifId]);
      if (!rows) {
        return 'Sorry, gif not found';
      }
      deleted = rows[0];
      if (rows[0].userId === gifToDelete.userId) {
        const newGifQuery = 'DELETE FROM gifs WHERE "gifId" = ($1)';
        const values = [`${gifToDelete.gifId}`];
        await pool.query(newGifQuery, values);
        return deleted;
      }
      return rows[0];
    } catch (error) {
      throw error;
    }
  }

  static async commentGif(commentToAdd) {
    try {
      let deleted = [];
      const { rows } = await pool.query('SELECT * from gifs WHERE "gifId" = $1', [commentToAdd.gifId]);
      if (!rows) {
        return 'Sorry, gif not found';
      }
      deleted = rows[0];
      if (rows[0]) {
        const newGifQuery = 'INSERT INTO comments ("comment", "type", "typeId", "userId") VALUES($1, $2, $3, $4) RETURNING *';
        const values = [`${commentToAdd.comment}`, `${commentToAdd.type}`, `${commentToAdd.gifId}`, `${commentToAdd.userId}`];
        const result = await pool.query(newGifQuery, values);
        const res = result.rows[0];
        console.log(res, deleted);
      }
      return rows[0];
    } catch (error) {
      throw error;
    }
  }

  static async flagGif(flagToAdd) {
    try {
      const res = await pool.query('SELECT "userId", type, "typeId" FROM flags WHERE ("userId" = $1 AND "typeId" = $2) AND type = $3', [flagToAdd.userId, flagToAdd.typeId, flagToAdd.type]);
      const result = res.rows[0];
      if (result && result.type === 'gif') {
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

module.exports = GifService;
