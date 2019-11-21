const pool = require('../config/dbConfig');

/** * Create flags Tables */
const createFlagsTable = () => {
  const queryText = `CREATE TABLE IF NOT EXISTS flags (
                      "flagId" SERIAL PRIMARY KEY,
                      "userId" SERIAL REFERENCES users ("userId"),
                      "type" VARCHAR(255) NOT NULL,
                      "typeId" INTEGER NOT NULL,
                      "createdOn" TIMESTAMP DEFAULT current_timestamp
                    )`;

  pool.query(queryText)
    .then((res) => {
      return res;
    })
    .catch((err) => {
      return err;
    });
};

/** * Drop flags Tables */
const dropFlagsTable = () => {
  const queryText = 'DROP TABLE IF EXISTS flags';
  pool.query(queryText)
    .then((res) => {
      return res;
    })
    .catch((err) => {
      return err;
    });
};

module.exports = {
  createFlagsTable,
  dropFlagsTable
};
