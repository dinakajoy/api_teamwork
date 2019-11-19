const { createUsersTable } = require('./user');
const { dropUsersTable } = require('./user');
const { createArticlesTable } = require('./article');
const { dropArticlesTable } = require('./article');
const { createGifsTable } = require('./gif');
const { dropGifsTable } = require('./gif');
const { createCategoriesTable } = require('./category');
const { dropCategoriesTable } = require('./category');
const { createFlagsTable } = require('./flag');
const { dropFlagsTable } = require('./flag');
const { createCommentsTable } = require('./comment');
const { dropCommentsTable } = require('./comment');

const createTables = () => {
  createUsersTable();
  createCategoriesTable();
  createArticlesTable();
  createGifsTable();
  createCommentsTable();
  createFlagsTable();
};

const dropTables = () => {
  dropFlagsTable();
  dropCommentsTable();
  dropGifsTable();
  dropArticlesTable();
  dropCategoriesTable();
  dropUsersTable();
};

module.exports = {
  createTables,
  dropTables
};

require('make-runnable');

// To execute
/*
  node api/v1/models/index createTables
  node api/v1/models/index dropTables
*/
