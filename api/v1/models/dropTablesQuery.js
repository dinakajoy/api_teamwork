const pool = require('../config/dbConfig');

exports.dropTables = async () => {
  await pool.query('DROP TABLE users, categories, articles, gifs, flags, comments CASCADE');
};
