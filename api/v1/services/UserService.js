/* eslint-disable no-useless-catch */
const pool = require('../config/dbConfig');

class UserService {
  static async addUser(newUser) {
    try {
      const newUserQuery = 'INSERT INTO users ("firstName", "lastName", "email", "password", "gender", "jobRole", "department", "address", "isAdmin") VALUES($1, $2, $3, $4, $5, $6, $7, $8, $9) RETURNING *';
      const values = [`${newUser.firstName}`, `${newUser.lastName}`, `${newUser.email}`, `${newUser.password}`, `${newUser.gender}`, `${newUser.jobRole}`, `${newUser.department}`, `${newUser.address}`, `${newUser.isAdmin}`];
      const result = await pool.query(newUserQuery, values);
      return result;
    } catch (error) {
      throw error;
    }
  }

  static async getUser(getUser) {
    try {
      const getUserQuery = 'SELECT "userId", "firstName", "lastName", "email", "password", "gender", "jobRole", "department", "address", "isAdmin" FROM users WHERE email = $1';
      const values = [`${getUser}`];
      const result = await pool.query(getUserQuery, values);
      return result;
    } catch (error) {
      throw error;
    }
  }

  static async getAdmin(getUser) {
    try {
      const getUserQuery = 'SELECT "userId", "firstName", "lastName", "email", "password", "gender", "jobRole", "department", "address", "isAdmin"  FROM users WHERE "userId" = $1';
      const values = [`${getUser}`];
      const result = await pool.query(getUserQuery, values);
      return result;
    } catch (error) {
      throw error;
    }
  }
}

module.exports = UserService;
