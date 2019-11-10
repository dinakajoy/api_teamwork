const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { check, validationResult } = require('express-validator');
require('dotenv').config();

const UserService = require('../services/UserService');
const Util = require('../utils/Utils');
const authDetails = require('../middleware/authMiddleware');

const util = new Util();

exports.signup = async (req, res) => {
  const validationData = [
    check(req.body.isAdmin).isBoolean(),
    check(req.body.firstName).isLength({ min: 3 }).isAlpha(),
    check(req.body.lastName).isLength({ min: 3 }),
    check(req.body.email).isEmail(),
    check(req.body.password).isLength({ min: 6 }),
    check(req.body.gender).isIn(['male', 'female']),
    check(req.body.jobRole).isLength({ min: 2 }),
    check(req.body.department).isLength({ min: 2 }),
    check(req.body.address).isLength({ min: 2 })
  ];
  const errors = validationResult(validationData);
  if (!errors.isEmpty()) {
    util.setError(400, errors.msg);
    return util.send(res);
  }
  const hash = bcrypt.hashSync(req.body.password, bcrypt.genSaltSync(8));
  const newUser = {
    isAdmin: req.body.name,
    firstName: req.body.firstName,
    lastName: req.body.lastName,
    email: req.body.email,
    password: hash,
    gender: req.body.gender,
    jobRole: req.body.jobRole,
    department: req.body.email,
    address: req.body.address
  };
  try {
    const result = await UserService.addUser(newUser);
    util.setSuccess(201, {
      message: 'User account successfully created',
      token: req.headers.authorization,
      userId: result.rows[0].userId
    });
    return util.send(res);
  } catch (error) {
    util.setError(400, error.message);
    return util.send(res);
  }
};

exports.signin = async (req, res) => {
  const validationData = [
    check(req.body.email).isEmail(),
    check(req.body.password).isLength({ min: 6 })
  ];
  const errors = validationResult(validationData);
  if (!errors.isEmpty()) {
    util.setError(400, errors.msg);
    return util.send(res);
  }
  const userDetails = {
    email: req.body.email,
    password: req.body.password
  };
  try {
    await UserService.getUser(userDetails.email)
      .then((user) => {
        if (!user || user.rows < 1) {
          util.setError(401, 'Sorry, Your Email Does Not Exist!');
          return util.send(res);
        }
        const passwrd = user.rows[0].password;
        return bcrypt.compare(userDetails.password, passwrd).then((result) => {
          if (!result) {
            util.setError(401, 'Incorrect password!');
            return util.send(res);
          }
          const token = jwt.sign(
            { userId: user.rows[0].userId },
            process.env.SECRET_TOKEN,
            { expiresIn: '24h' }
          );
          util.setSuccess(200, {
            userId: user.rows[0].userId,
            token,
            firstName: user.rows[0].firstName,
            lastName: user.rows[0].lastName
          });
          return util.send(res);
        }).catch((error) => {
          util.setError(500, error.message);
          return util.send(res);
        });
      }).catch((error) => {
        util.setError(400, error.message);
        return util.send(res);
      });
  } catch (error) {
    util.setError(500, error.message);
    return util.send(res);
  }
  return res.end;
};
