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
      console.log(res);
      pool.end();
    })
    .catch((err) => {
      console.log(err);
      pool.end();
    });
};

/** * Drop users Tables */
const dropUsersTable = () => {
  const queryText = 'DROP TABLE IF EXISTS users';
  pool.query(queryText)
    .then((res) => {
      console.log(res);
      pool.end();
    })
    .catch((err) => {
      console.log(err);
      pool.end();
    });
};

const addAdmin = () => {
  const queryText = 'INSERT INTO users ("isAdmin", "firstName", "lastName", "email", "password", "gender", "jobRole", "department", "address") VALUES($1, $2, $3, $4, $5, $6, $7, $8, $9) RETURNING *';
  const values = [true, 'admin', 'admin', 'admin@gmail.com', 'Admin@2019', 'male', 'manager', 'administrative', '5 mainland street, lagos state'];
  pool.query(queryText, values)
    .then((res) => {
      console.log(res);
      pool.end();
    })
    .catch((err) => {
      console.log(err);
      pool.end();
    });
};

module.exports = {
  createUsersTable,
  dropUsersTable,
  addAdmin
};
