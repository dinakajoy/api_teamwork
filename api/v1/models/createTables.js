const pool = require('../config/dbConfig');

exports.usersTable = async () => {
  const queryText = `CREATE TABLE IF NOT EXISTS users (
                      "userId" SERIAL PRIMARY KEY,
                      "isAdmin" BOOLEAN NOT NULL DEFAULT false,
                      "firstName" VARCHAR(255) NOT NULL,
                      "lastName" VARCHAR(255) NOT NULL,
                      "email" VARCHAR(255) NOT NULL UNIQUE,
                      "password" VARCHAR(255) NOT NULL,
                      "picture" VARCHAR(255) NOT NULL DEFAULT 'userPhoto.png',
                      "gender" VARCHAR(255) NOT NULL,
                      "jobRole" VARCHAR(255) NOT NULL,
                      "department" VARCHAR(255) NOT NULL,
                      "address" VARCHAR(255) NOT NULL,
                      "createdOn" TIMESTAMP NOT NULL DEFAULT current_timestamp,
                      "updatedOn" TIMESTAMP NOT NULL DEFAULT current_timestamp
                    )`;
  await pool.query(queryText);
};

exports.categoriesTable = async () => {
  const queryText = `CREATE TABLE IF NOT EXISTS categories (
                      "categoryId" SERIAL PRIMARY KEY,
                      "category" VARCHAR(255) NOT NULL
                    )`;
  await pool.query(queryText);
};

exports.articlesTable = async () => {
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
  await pool.query(queryText);
};

exports.gifsTable = async () => {
  const queryText = `CREATE TABLE IF NOT EXISTS gifs (
                      "gifId" SERIAL PRIMARY KEY,
                      "title" VARCHAR(255),
                      "imageUrl" VARCHAR(255) NOT NULL,
                      "public_id" VARCHAR(255) NOT NULL,
                      "createdOn" TIMESTAMP DEFAULT current_timestamp,
                      "userId" SERIAL REFERENCES users ("userId")
                    )`;
  await pool.query(queryText);
};

exports.commentsTable = async () => {
  const queryText = `CREATE TABLE IF NOT EXISTS comments (
                      "commentId" SERIAL PRIMARY KEY,
                      "comment" VARCHAR(255) NOT NULL,
                      "type" VARCHAR(255) NOT NULL,
                      "typeId" INTEGER NOT NULL,
                      "createdOn" TIMESTAMP DEFAULT current_timestamp,
                      "userId" SERIAL REFERENCES users ("userId")
                    )`;
  await pool.query(queryText);
};

exports.flagsTable = async () => {
  const queryText = `CREATE TABLE IF NOT EXISTS flags (
                      "flagId" SERIAL PRIMARY KEY,
                      "userId" SERIAL REFERENCES users ("userId"),
                      "type" VARCHAR(255) NOT NULL,
                      "typeId" INTEGER NOT NULL,
                      "createdOn" TIMESTAMP DEFAULT current_timestamp
                    )`;
  await pool.query(queryText);
};
