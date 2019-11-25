const Helpers = require('../helper/Helper');

module.exports = async (req) => {
  const token = req.headers.authorization.split(' ')[1];
  const decodedToken = await Helpers.verifyToken(token);
  return decodedToken.userId;
};
