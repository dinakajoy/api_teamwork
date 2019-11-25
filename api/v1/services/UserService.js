const query = require('../config/queryConfig');
const articleService = require('../services/ArticleService');
const gifService = require('../services/GifService');
const commentService = require('../services/CommentService');
const flagService = require('../services/FlagService');

class UserService {
  static async createUser(newUser) {
    const newUserQuery = 'INSERT INTO users ("isAdmin", "firstName", "lastName", "email", "password", "gender", "jobRole", "department", "address") VALUES($1, $2, $3, $4, $5, $6, $7, $8, $9) RETURNING *';
    const values = [`${newUser.isAdmin}`, `${newUser.firstName}`, `${newUser.lastName}`, `${newUser.email}`, `${newUser.password}`, `${newUser.gender}`, `${newUser.jobRole}`, `${newUser.department}`, `${newUser.address}`];
    try {
      const result = await query.queryResult(newUserQuery, values);
      return result;
    } catch (error) {
      return error;
    }
  }

  static async checkUser(getUser) {
    const getUserQuery = 'SELECT "userId", "isAdmin", "firstName", "lastName", "email", "password", "gender", "jobRole", "department", "address" FROM users WHERE "userId" = $1';
    const values = [getUser];
    try {
      const result = await query.queryResult(getUserQuery, values);
      return result;
    } catch (error) {
      return error;
    }
  }

  static async getUser(userEmail) {
    const getUserQuery = 'SELECT "userId", "isAdmin", "firstName", "lastName", "email", "password", "picture", "gender", "jobRole", "department", "address" FROM users WHERE email = $1';
    const values = [userEmail];
    try {
      const result = query.queryResult(getUserQuery, values);
      return result;
    } catch (error) {
      return error;
    }
  }

  static async getUsers() {
    const usersQuery = 'SELECT  "userId", "isAdmin", "firstName", "lastName", "email", "gender", "jobRole", "department", "address" FROM users';
    try {
      const result = query.queryResult(usersQuery);
      return result;
    } catch (error) {
      return error;
    }
  }

  static async updateUser(user) {
    const getUser = await UserService.checkUser(user[2]);
    if (getUser.length < 1) {
      return !getUser;
    }
    const userQuery = `UPDATE users SET ${user[0]} = ($1) WHERE "userId" = ($2)`;
    const values = [user[1], user[2]];
    const result = await query.updateQueryResult(userQuery, values);
    if (result === 'Successful') {
      return getUser;
    }
    return !result;
  }

  static async editUser(user) {
    const getUser = await UserService.checkUser(user.userId);
    if (getUser.length < 1) {
      return !user;
    }
    const userQuery = 'UPDATE users SET "isAdmin" = ($1), "firstName" = ($2), "lastName" = ($3), "email" = ($4), "gender" = ($5), "jobRole" = ($6), "department" = ($7), "address" = ($8) WHERE "userId" = ($9)';
    const values = [`${user.isAdmin}`, `${user.firstName}`, `${user.lastName}`, `${user.email}`, `${user.gender}`, `${user.jobRole}`, `${user.department}`, `${user.address}`, user.userId];
    const result = await query.updateQueryResult(userQuery, values);
    if (result === 'Successful') {
      return getUser;
    }
    return !result;
  }

  static async deleteUser(user) {
    const getUser = await UserService.checkUser(user);
    if (getUser.rows.length < 1) {
      return !user;
    }
    await articleService.deleteUserArticle(user);
    await gifService.deleteUserGif(user);
    await commentService.deleteUserComments(user);
    await flagService.deleteUserFlags(user);
    const result = await query.updateQueryResult('DELETE FROM users WHERE "userId" = ($1)', [user]);
    if (result === 'Successful') {
      return getUser.rows[0];
    }
    return !result;
  }
}

module.exports = UserService;
