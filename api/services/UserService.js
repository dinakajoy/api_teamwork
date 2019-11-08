/* eslint-disable no-useless-catch */
const pool = require('../config/config');
// const testPool = require('../db_config/test_config');

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
}

module.exports = UserService;
