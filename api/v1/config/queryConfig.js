const pool = require('../config/dbConfig');

exports.queryResult = async (query, values = null) => {
  try {
    const { rows } = await pool.query(query, values);
    return rows;
  } catch (error) {
    return { error: error.message };
  }
};

exports.updateQueryResult = async (query, values = null) => {
  try {
    await pool.query(query, values);
    return 'Successful';
  } catch (error) {
    return { error: error.message };
  }
};
