const jwt = require('jsonwebtoken');
require('dotenv').config();

const UserService = require('../services/UserService');
const Util = require('../utils/Utils');

const util = new Util();

module.exports = async (req, res, next) => {
  const userToken = req.headers.authorization;
  if (!userToken) {
    util.setError(400, 'Token is not provided');
    return util.send(res);
  }
  try {
    const token = req.headers.authorization.split(' ')[1];
    const decodedToken = jwt.verify(token, process.env.SECRET_TOKEN);
    const userId = decodedToken.userId;
    const { rows } = await UserService.getAdmin(userId);
    if (!rows[0]) {
      util.setError(400, 'Sorry, Token is invalid');
      return util.send(res);
    }
    next();
    const authDetails = { token: userToken, userId };
    return authDetails;
  } catch (error) {
    util.setError(400, error.message);
    return util.send(res);
  }
};
