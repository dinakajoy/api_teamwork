/* eslint-disable no-useless-catch */
const pool = require('../config/dbConfig');

class UserService {
  static async addUser(newUser) {
    try {
      const newUserQuery = 'INSERT INTO users ("isAdmin", "firstName", "lastName", "email", "password", "gender", "jobRole", "department", "address") VALUES($1, $2, $3, $4, $5, $6, $7, $8, $9) RETURNING *';
      const values = [`${newUser.isAdmin}`, `${newUser.firstName}`, `${newUser.lastName}`, `${newUser.email}`, `${newUser.password}`, `${newUser.gender}`, `${newUser.jobRole}`, `${newUser.department}`, `${newUser.address}`];
      const { rows } = await pool.query(newUserQuery, values);
      return rows[0];
    } catch (error) {
      throw error;
    }
  }

  static async getUser(getUser) {
    try {
      const getUserQuery = 'SELECT "userId", "isAdmin", "firstName", "lastName", "email", "password", "picture", "gender", "jobRole", "department", "address" FROM users WHERE email = $1';
      const values = [getUser];
      const { rows } = await pool.query(getUserQuery, values);
      return rows[0];
    } catch (error) {
      throw error;
    }
  }

  static async getAdmin(getUser) {
    try {
      const getUserQuery = 'SELECT "userId", "isAdmin", "firstName", "lastName", "email", "password", "gender", "jobRole", "department", "address" FROM users WHERE "userId" = $1';
      const values = [`${getUser}`];
      const result = await pool.query(getUserQuery, values);
      return result;
    } catch (error) {
      throw error;
    }
  }

  static async editUser(user) {
    try {
      const userQuery = 'UPDATE users SET "isAdmin" = ($2), "firstName" = ($3), "lastName" = ($4), "email" = ($5), "gender" = ($6), "jobRole" = ($7), "department" = ($8), "address" = ($9) WHERE "userId" = ($1)';
      const values = [`${user.userId}`, `${user.isAdmin}`, `${user.firstName}`, `${user.lastName}`, `${user.email}`, `${user.gender}`, `${user.jobRole}`, `${user.department}`, `${user.address}`];
      await pool.query(userQuery, values);
      return 'Successfully updated account';
    } catch (error) {
      throw error;
    }
  }

  static async deleteUser(user) {
    try {
      const userQuery = 'DELETE FROM users WHERE "userId" = ($1)';
      const values = [`${user}`];
      await pool.query(userQuery, values);
      return 'Successfully deleted account';
    } catch (error) {
      throw error;
    }
  }

  static async changePhoto(user) {
    try {
      const { rows } = await pool.query('SELECT * from users WHERE "userId" = $1', [user.userId]);
      if (rows === undefined || !rows[0]) {
        return 'Sorry, User was not found';
      }
      if (rows[0].userId !== user.userId) {
        return 'Unauthorized user';
      }
      const userQuery = 'UPDATE users SET "picture" = ($1) WHERE "userId" = ($2)';
      const values = [`${user.picture}`, `${user.userId}`];
      await pool.query(userQuery, values);
      return 'Photo successfully changed';
    } catch (error) {
      throw error;
    }
  }

  static async changePassword(user) {
    try {
      const { rows } = await pool.query('SELECT * from users WHERE "userId" = $1', [user.userId]);
      if (rows === undefined || !rows[0]) {
        return 'Sorry, User was not found';
      }
      if (rows[0].userId !== user.userId) {
        return 'Unauthorized user';
      }
      const userQuery = 'UPDATE users SET "password" = ($2) WHERE "userId" = ($1)';
      const values = [`${user.userId}`, `${user.password}`];
      await pool.query(userQuery, values);
      return 'Password successfully changed';
    } catch (error) {
      throw error;
    }
  }
}

module.exports = UserService;
