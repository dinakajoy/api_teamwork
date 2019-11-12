/* eslint-disable no-useless-catch */
const pool = require('../config/dbConfig');

class GifService {
  static async addGif(newGif) {
    try {
      const newGifQuery = 'INSERT INTO gifs ("title", "imageUrl", "public_id", "userId") VALUES($1, $2, $3, $4) RETURNING *';
      const values = [`${newGif.title}`, `${newGif.imageUrl}`, `${newGif.public_id}`, `${newGif.userId}`];
      const result = await pool.query(newGifQuery, values);
      return result;
    } catch (error) {
      throw error;
    }
  }
}

module.exports = GifService;
