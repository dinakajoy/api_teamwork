/* eslint-disable no-useless-catch */
const query = require('../config/queryConfig');
const commentService = require('../services/CommentService');
const flagService = require('../services/FlagService');

class GifService {
  static async createGif(newGif) {
    const newGifQuery = 'INSERT INTO gifs ("title", "imageUrl", "public_id", "userId") VALUES($1, $2, $3, $4) RETURNING *';
    const values = [`${newGif.title}`, `${newGif.imageUrl}`, `${newGif.public_id}`, `${newGif.userId}`];
    const rows = await query.queryResult(newGifQuery, values);
    return rows;
  }

  static async getGif(gifId) {
    const getGifQuery = `SELECT 
              g."gifId", g.title, g."imageUrl", g.public_id, g."createdOn", concat("firstName", ' ', "lastName") AS author
              FROM gifs g 
              INNER JOIN users u ON g."userId" = u."userId"  
              WHERE "gifId" = $1`;
    const values = [gifId];
    const queryDetails = { type: 'gif', typeId: gifId };
    const comment = await commentService.getComments(queryDetails);
    const flag = await flagService.getFlaggedItem(queryDetails);
    const gif = await query.queryResult(getGifQuery, values);
    return [gif[0], comment, flag];
  }

  static async deleteGif(gifToDelete) {
    try {
      let deleted = [];
      const rows = await query.queryDetails('SELECT * from gifs WHERE "gifId" = $1', [gifToDelete.gifId]);
      if (!rows || rows.length < 1) {
        return !rows;
      }
      deleted = rows[0];
      const deleteDetails = { type: 'gif', typeId: gifToDelete.gifId };
      await commentService.deleteCommentByItem(deleteDetails);
      await flagService.deleteFlagByItem(deleteDetails);
      const newGifQuery = 'DELETE FROM gifs WHERE "gifId" = ($1)';
      const values = [`${gifToDelete.gifId}`];
      await query.updateQueryResult(newGifQuery, values);
      return deleted;
    } catch (error) {
      throw error;
    }
  }

  // Delete users gif when user is deleted
  static async deleteUserGif(userId) {
    try {
      let deleted = [];
      const rows = await query.queryDetails('SELECT * from gifs WHERE "userId" = $1', [userId]);
      if (!rows || rows.length < 1) {
        return !rows;
      }
      deleted = rows[0];
      const deleteDetails = { type: 'gif', typeId: rows[0].gifId };
      await commentService.deleteCommentByItem(deleteDetails);
      await flagService.deleteFlagByItem(deleteDetails);
      const newGifQuery = 'DELETE FROM gifs WHERE "userId" = $1';
      const values = [userId];
      await query.updateQueryResult(newGifQuery, values);
      return deleted;
    } catch (error) {
      throw error;
    }
  }

  static async commentGif(commentToAdd) {
    const rows = await query.queryResult('SELECT * from gifs WHERE "gifId" = $1', [commentToAdd.gifId]);
    if (!rows) {
      return 'Sorry, gif not found';
    }
    const result = commentService.createComment(commentToAdd);
    return result;
  }

  static async flagGif(flagToAdd) {
    const rows = await query.queryResult('SELECT * from gifs WHERE "gifId" = $1', [flagToAdd.typeId]);
    if (!rows) {
      return 'Sorry, article not found';
    }
    const result = await flagService.createFlag(flagToAdd);
    return result.message;
  }
}

module.exports = GifService;
