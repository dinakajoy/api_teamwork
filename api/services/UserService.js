/* eslint-disable no-useless-catch */
const pool = require('../config/config');

class UserService {
  static async addUser(newUser) {
    try {
      const newUserQuery = 'INSERT INTO users ("firstName", "lastName", "email", "password", "gender", "jobRole", "department", "address") VALUES($1, $2, $3, $4, $5, $6, $7, $8) RETURNING *';
      const values = [`${newUser.firstName}`, `${newUser.lastName}`, `${newUser.email}`, `${newUser.password}`, `${newUser.gender}`, `${newUser.jobRole}`, `${newUser.department}`, `${newUser.address}`];
      const result = await pool.query(newUserQuery, values);
      return result;
    } catch (error) {
      throw error;
    }
  }

  static async getUser(getUser) {
    try {
      const getUserQuery = 'SELECT "userId", "firstName", "lastName", "email", "password", "gender", "jobRole", "department", "address"  FROM users WHERE email = $1';
      const values = [`${getUser}`];
      const result = await pool.query(getUserQuery, values);
      return result;
    } catch (error) {
      throw error;
    }
  }
}

module.exports = UserService;
