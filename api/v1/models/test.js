const pool = require('../config/dbConfig');

/** * Create gifs Tables */
const deleteTestRecord = () => {
  const queryText = 'DELETE FROM users WHERE email = \'tester@gmail.com\'';

  pool.query(queryText)
    .then((res) => {
      console.log('Users record deleted successfully');
      pool.end();
      return res;
    })
    .catch((err) => {
      console.log(err);
      pool.end();
    });
};

module.exports = {
  deleteTestRecord
};

require('make-runnable');
