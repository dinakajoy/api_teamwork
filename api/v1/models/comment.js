const pool = require('../config/dbConfig');

/** * Create comments Tables */
const createCommentsTable = () => {
  const queryText = `CREATE TABLE IF NOT EXISTS comments (
                      "commentId" SERIAL PRIMARY KEY,
                      "comment" VARCHAR(255) NOT NULL,
                      "type" VARCHAR(255) NOT NULL,
                      "typeId" INTEGER NOT NULL,
                      "createdOn" TIMESTAMP DEFAULT current_timestamp,
                      "userId" SERIAL REFERENCES users ("userId")
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

/** * Drop comments Tables */
const dropCommentsTable = () => {
  const queryText = 'DROP TABLE IF EXISTS comments';
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

module.exports = {
  createCommentsTable,
  dropCommentsTable
};
