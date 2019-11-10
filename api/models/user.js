const pool = require('../config/config');

/* * Create users Table * */
const createUsersTable = () => {
  const queryText = `
    CREATE TABLE IF NOT EXISTS
      users (
        "userId" SERIAL PRIMARY KEY,
        "isAdmin" BOOLEAN NOT NULL DEFAULT FALSE,
        "firstName" VARCHAR(255) NOT NULL,
        "lastName" VARCHAR(255) NOT NULL,
        "email" VARCHAR(255) NOT NULL UNIQUE,
        "password" VARCHAR(255) NOT NULL,
        "picture" VARCHAR(255) NOT NULL DEFAULT 'userPhoto.png',
        "gender" VARCHAR(255) NOT NULL,
        "jobRole" VARCHAR(255) NOT NULL,
        "department" VARCHAR(255) NOT NULL,
        "address" VARCHAR(255) NOT NULL,
        "created_at" TIMESTAMP NOT NULL DEFAULT current_timestamp,
        "updated_at" TIMESTAMP NOT NULL DEFAULT current_timestamp
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

/* * Drop User Table * */
// const dropUsersTable = () => {
//   const queryText = 'DROP TABLE IF EXISTS users returning *';
//   pool.query(queryText)
//     .then((res) => {
//       console.log(res);
//       pool.end();
//     })
//     .catch((err) => {
//       console.log(err);
//       pool.end();
//     });
// };

// pool.on('remove', () => {
//   console.log('Client Removed');
//   process.exit(0);
// });

module.exports = {
  createUsersTable
  // dropUsersTable
};

require('make-runnable');
