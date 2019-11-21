const pool = require('../config/dbConfig');

/** * Create users Tables */
const createUsersTable = () => {
  const queryText = `CREATE TABLE IF NOT EXISTS users (
                      "userId" SERIAL PRIMARY KEY,
                      "isAdmin" BOOLEAN NOT NULL DEFAULT false,
                      "firstName" VARCHAR(255) NOT NULL,
                      "lastName" VARCHAR(255) NOT NULL,
                      "email" VARCHAR(255) NOT NULL UNIQUE,
                      "password" VARCHAR(255) NOT NULL,
                      "picture" VARCHAR(255) NOT NULL DEFAULT 'userPhoto.png',
                      "gender" VARCHAR(255) NOT NULL,
                      "jobRole" VARCHAR(255) NOT NULL,
                      "department" VARCHAR(255) NOT NULL,
                      "address" VARCHAR(255) NOT NULL,
                      "createdOn" TIMESTAMP NOT NULL DEFAULT current_timestamp,
                      "updatedOn" TIMESTAMP NOT NULL DEFAULT current_timestamp
                    )`;

  pool.query(queryText)
    .then((res) => {
      return res;
    })
    .catch((err) => {
      return err;
    });
};

/** * Drop users Tables */
const dropUsersTable = () => {
  const queryText = 'DROP TABLE IF EXISTS users';
  pool.query(queryText)
    .then((res) => {
      return res;
    })
    .catch((err) => {
      return err;
    });
};

module.exports = {
  createUsersTable,
  dropUsersTable
};
