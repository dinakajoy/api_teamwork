require('dotenv').config();

const { Pool } = require('pg');

// const env = process.env.NODE_ENV ? process.env.NODE_ENV : 'development';
console.log('This is the environment: ', process.env.NODE_ENV);

let pool;
const connectString = `postgresql://${process.env.DB_USER}:${process.env.DB_PASSWORD}@${process.env.DB_HOST}:${process.env.DB_PORT}/${process.env.DB_DATABASE}`;
const testConnectString = `postgresql://${process.env.DB_USER}:${process.env.DB_PASSWORD}@${process.env.DB_HOST}:${process.env.DB_PORT}/test_teamwork`;

if (process.env.NODE_ENV === 'production') {
  pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: process.env.NODE_ENV === 'production'
  });
} else if (process.env.NODE_ENV === 'test') {
  pool = new Pool({
    connectionString: testConnectString
  });
} else {
  pool = new Pool({
    connectionString: connectString
  });
}

if (!pool) {
  console.log('Database Setup  Was Unsuccessful');
  process.exit(1);
} else {
  pool.on('connect', () => {
    console.log('connected to the Database Successfully');
  });
}

function dbQuery(sql) {
  pool.query(sql)
    .then((res) => {
      return res;
    })
    .catch((err) => {
      return err;
    });
  pool.end();
}

module.exports.dbQuery = dbQuery;
module.exports = pool;
