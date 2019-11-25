const query = require('../config/queryConfig');

class FlagService {
  // To create flag based on item (comment, article, gif)
  static async createFlag(flagToAdd) {
    const checkFlag = await query.queryResult('SELECT "userId", type, "typeId" FROM flags WHERE "userId" = $1 AND "typeId" = $2 AND "type" = $3', [flagToAdd.userId, flagToAdd.typeId, flagToAdd.type]);
    if (checkFlag.length > 0) {
      await query.queryResult('DELETE FROM flags WHERE "userId" = $1 AND "typeId" = $2 AND "type" = $3', [flagToAdd.userId, flagToAdd.typeId, flagToAdd.type]);
      return { message: 'Successfully unflagged item' };
    }
    const newFlagQuery = 'INSERT INTO flags ("userId", "type", "typeId") VALUES($1, $2, $3) RETURNING *';
    const values = [`${flagToAdd.userId}`, `${flagToAdd.type}`, `${flagToAdd.typeId}`];
    try {
      await query.queryResult(newFlagQuery, values);
      return { message: 'Successfully flagged item' };
    } catch (error) {
      return error;
    }
  }

  // To get all flags based on item (comment, article, gif)
  static async getFlaggedItem(flagToGet) {
    const flagQuery = `SELECT 
                concat("firstName", ' ', "lastName") AS "Flagged by" 
                FROM flags f 
                INNER JOIN users u ON f."userId" = u."userId" 
                WHERE f."typeId" = $1 AND "type" = $2`;
    const values = [flagToGet.typeId, flagToGet.type];
    const result = await query.queryResult(flagQuery, values);
    if (result.length < 1 || !result) {
      return !result;
    }
    return result;
  }

  // To get all flagged items
  static async getFlaggedItems(flagToGet) {
    const flagQuery = `SELECT 
                concat("firstName", ' ', "lastName") AS "Flagged by" 
                FROM flags f 
                INNER JOIN users u ON f."userId" = u."userId" 
                WHERE f."typeId" = $1 AND "type" = $2`;
    const values = [flagToGet.typeId, flagToGet.type];
    const result = await query.queryResult(flagQuery, values);
    if (result.length < 1 || !result) {
      return !result;
    }
    return result;
  }

  // To delete all flags when item (comment, article, gif) is deleted
  static async deleteFlagByItem(flagToDelete) {
    const rows = await query.queryResult('SELECT "flagId", type, "typeId", "userId", "createdOn" FROM flags WHERE "typeId"=$1 && "type"=$2', [flagToDelete.typeId, flagToDelete.type]);
    if (rows.length < 1 || !rows) {
      return !rows;
    }
    await query.queryResult('DELETE FROM flags WHERE "typeId"=$1 && "type"=$2', [flagToDelete.typeId, flagToDelete.type]);
    return rows;
  }

  // To delete all users flags when user is deleted
  static async deleteUserFlags(userId) {
    const rows = await query.queryResult('SELECT "flagId", type, "typeId", "userId", "createdOn" FROM flags WHERE "userId"=$1', [userId]);
    if (rows.length < 1 || !rows) {
      return !rows;
    }
    await query.queryResult('DELETE FROM flags WHERE "userId"=$1', [userId]);
    return rows;
  }
}

module.exports = FlagService;
