const createTables = require('./createTables');
const { dropTables } = require('./dropTablesQuery');

const createAllTables = async () => {
  await createTables.usersTable();
  await createTables.categoriesTable();
  await createTables.articlesTable();
  await createTables.gifsTable();
  await createTables.flagsTable();
  await createTables.commentsTable();
};

const dropAllTables = () => {
  dropTables();
};

module.exports = {
  createAllTables,
  dropAllTables
};

require('make-runnable');

// To execute
/*
  node api/v1/models/index createAllTables
  node api/v1/models/index dropAllTables
*/
