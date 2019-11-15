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
}

module.exports = GifService;
