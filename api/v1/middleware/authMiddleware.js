const Helpers = require('../helper/Helper');

const UserService = require('../services/UserService');
const Util = require('../utils/Utils');

const util = new Util();

module.exports = async (req, res, next) => {
  const userToken = req.headers.authorization;
  if (!userToken) {
    util.setError(404, 'Token is not provided');
    return util.send(res);
  }
  try {
    const token = req.headers.authorization.split(' ')[1];
    const decodedToken = await Helpers.verifyToken(token);
    const userId = decodedToken.userId;
    const result = await UserService.checkUser(userId);
    if (!result) {
      util.setError(401, 'Invalid credentials');
      return util.send(res);
    }
    const rows = result[0];
    if (rows.error) {
      util.setError(500, rows.error);
      return util.send(res);
    }
    if (!rows.userId) {
      util.setError(401, 'Sorry, You Are Not Authorized For This Action');
      return util.send(res);
    }
    next();
    return rows.userId;
  } catch (error) {
    util.setError(400, error.message);
    return util.send(res);
  }
};
