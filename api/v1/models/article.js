const pool = require('../config/dbConfig');

/** * Create articles Tables */
const createArticlesTable = () => {
  const queryText = `CREATE TABLE IF NOT EXISTS articles (
                      "articleId" SERIAL PRIMARY KEY,
                      "categoryId" SERIAL REFERENCES categories ("categoryId"),
                      "title" VARCHAR(255) NOT NULL,
                      "article" TEXT NOT NULL,
                      "articleImage" VARCHAR(255) DEFAULT 'poster.png',
                      "createdOn" TIMESTAMP DEFAULT current_timestamp,
                      "updatedOn" TIMESTAMP DEFAULT current_timestamp,
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

/** * Drop articles Tables */
const dropArticlesTable = () => {
  const queryText = 'DROP TABLE IF EXISTS articles';
  pool.query(queryText)
    .then((res) => {
      return res;
    })
    .catch((err) => {
      return err;
    });
};

module.exports = {
  createArticlesTable,
  dropArticlesTable
};
