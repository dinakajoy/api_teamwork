require('dotenv').config();
const { Pool } = require('pg');

let pool;
const connectionString = `postgresql://${process.env.DB_USER}:${process.env.DB_PASSWORD}@${process.env.DB_HOST}:${process.env.DB_PORT}/${process.env.DB_DATABASE}`;
const testConnectionString = `postgresql://${process.env.DB_USER}:${process.env.DB_PASSWORD}@${process.env.DB_HOST}:${process.env.DB_PORT}/test_teamwork`;

if (process.env.NODE_ENV === 'production') {
  pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: process.env.NODE_ENV === 'production'
  });
} else if (process.env.NODE_ENV === 'test') {
  pool = new Pool({
    connectionString: testConnectionString
  });
} else {
  pool = new Pool({
    connectionString
  });
}

if (!pool) {
  console.log('Database Setup  Was Unsuccessful');
  process.exit(1);
} else {
  pool.on('connect', () => {
    console.log('Database Connected Successfully');
  });
  console.log(`Running on ${process.env.NODE_ENV} environment`);
}

module.exports = pool;
