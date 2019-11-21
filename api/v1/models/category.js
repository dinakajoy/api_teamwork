const pool = require('../config/dbConfig');

/** * Create categories Tables */
const createCategoriesTable = () => {
  const queryText = `CREATE TABLE IF NOT EXISTS categories (
                      "categoryId" SERIAL PRIMARY KEY,
                      "category" VARCHAR(255) NOT NULL
                    )`;

  pool.query(queryText)
    .then((res) => {
      return res;
    })
    .catch((err) => {
      return err;
    });
};

/** * Drop categories Tables */
const dropCategoriesTable = () => {
  const queryText = 'DROP TABLE IF EXISTS categories';
  pool.query(queryText)
    .then((res) => {
      return res;
    })
    .catch((err) => {
      return err;
    });
};

module.exports = {
  createCategoriesTable,
  dropCategoriesTable
};
