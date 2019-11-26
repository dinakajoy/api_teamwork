/* eslint-disable no-useless-catch */
const query = require('../config/queryConfig');
const flagService = require('../services/FlagService');

class CommentService {
  // create comment based on item (article, gif)
  static async createComment(commentToAdd) {
    const newCommentQuery = 'INSERT INTO comments ("comment", "type", "typeId", "userId") VALUES($1, $2, $3, $4) RETURNING *';
    const values = [`${commentToAdd.comment}`, `${commentToAdd.type}`, `${commentToAdd.typeId}`, `${commentToAdd.userId}`];
    try {
      const insertFlag = await query.queryResult(newCommentQuery, values);
      return insertFlag;
    } catch (error) {
      return error;
    }
  }

  static async flagComment(flagToAdd) {
    const rows = await query.queryResult('SELECT * from comments WHERE "commentId" = $1', [flagToAdd.typeId]);
    if (rows.length < 1) {
      return !rows;
    }
    const result = await flagService.createFlag(flagToAdd);
    return result.message;
  }

  // User can edit their comments
  static async editComment(commentDetails) {
    const rows = await query.queryResult('SELECT * from comments WHERE "commentId" = $1 AND "userId"=$2', [commentDetails.commentId, commentDetails.userId]);
    if (rows.length < 1) {
      return !rows;
    }
    const result = await query.updateQueryResult('UPDATE comments SET comment=$1  WHERE "commentId" = $2 AND "userId"=$3', [commentDetails.comment, commentDetails.commentId, commentDetails.userId]);
    return result;
  }

  // User can delete their comments
  static async deleteComment(commentDetails) {
    const rows = await query.queryResult('SELECT * FROM comments WHERE "commentId" = $1 AND "userId"=$2', [commentDetails.commentId, commentDetails.userId]);
    if (rows.length < 1) {
      return !rows;
    }
    const result = await query.updateQueryResult('DELETE FROM comments WHERE "commentId" = $1 AND "userId"=$2', [commentDetails.commentId, commentDetails.userId]);
    return result;
  }

  // Comments can be deleted when item is deleted (article, gif)
  static async deleteCommentByItem(commentDetails) {
    const rows = await query.queryResult('SELECT * FROM comments WHERE "typeId" = $1 AND "type"=$2', [commentDetails.typeId, commentDetails.type]);
    if (!rows) {
      return !rows;
    }
    const result = await query.updateQueryResult('DELETE FROM comments WHERE "typeId" = $1 AND "type"=$2', [commentDetails.typeId, commentDetails.type]);
    return result.message;
  }

  // Comments can be deleted when user is deleted
  static async deleteUserComments(userId) {
    const rows = await query.queryResult('SELECT * FROM comments WHERE "userId" = $1', [userId]);
    if (!rows) {
      return !rows;
    }
    const result = await query.updateQueryResult('DELETE FROM comments WHERE "userId" = $1', [userId]);
    return result.message;
  }

  static async getComments(commentDetails) {
    let flag;
    const commentQuery = `SELECT 
            c."commentId", c.comment, concat("firstName", ' ', "lastName") AS "By" 
            FROM comments c
            INNER JOIN users u ON c."userId" = u."userId"
            WHERE type = $1 AND "typeId" = $2
            ORDER BY c."createdOn" DESC`;
    const values = [commentDetails.type, commentDetails.typeId];
    const result = await query.queryResult(commentQuery, values);
    flag = await flagService.getFlaggedItem(commentDetails);
    if (!flag) {
      flag = 'No flag for this comment';
    }
    if (result.length < 1 || !result) {
      return !result;
    }
    return [result, { flag }];
    // return [result];
  }
}

module.exports = CommentService;
