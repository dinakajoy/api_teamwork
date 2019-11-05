const { pg } = require('pg');

require('dotenv').config();

const config = {
  user: process.env.DB_USER,
  database: process.env.DB_DATABASE,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT,
  max: 10,
  idleTimeoutMillis: 30000,
};

const isProduction = process.env.NODE_ENV === 'production';
const pool = new pg.Pool({
  connectionString: isProduction ? process.env.DATABASE_URL : config,
  ssl: isProduction,
});

if (!pool) {
  console.log('Database Setup  Was Unsuccessful.');
  process.exit(1);
}

function dbQuery(sql) {
  return new Promise((resolve, reject) => {
    pool
      .query(sql)
      .then((res) => {
        resolve(res);
      })
      .catch((err) => {
        reject(err);
      });
  });
}

module.exports = { pool, dbQuery };
