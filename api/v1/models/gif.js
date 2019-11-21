const pool = require('../config/dbConfig');

/** * Create gifs Tables */
const createGifsTable = () => {
  const queryText = `CREATE TABLE IF NOT EXISTS gifs (
                      "gifId" SERIAL PRIMARY KEY,
                      "title" VARCHAR(255),
                      "imageUrl" VARCHAR(255) NOT NULL,
                      "public_id" VARCHAR(255) NOT NULL,
                      "createdOn" TIMESTAMP DEFAULT current_timestamp,
                      "userId" SERIAL REFERENCES users ("userId")
                    )`;

  pool.query(queryText)
    .then((res) => {
      return res;
    })
    .catch((err) => {
      return err;
    });
};

/** * Drop gifs Tables */
const dropGifsTable = () => {
  const queryText = 'DROP TABLE IF EXISTS gifs';
  pool.query(queryText)
    .then((res) => {
      return res;
    })
    .catch((err) => {
      return err;
    });
};

module.exports = {
  createGifsTable,
  dropGifsTable
};
