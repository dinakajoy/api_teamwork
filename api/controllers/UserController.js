const bcrypt = require('bcrypt');
const { check, validationResult } = require('express-validator');

const UserService = require('../services/UserService');
const Util = require('../utils/Utils');

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
    util.setError({ errors: errors.msg });
    return util.send(res);
  }
  const hash = bcrypt.hash(req.body.password, 10);
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
      userId: result.rows[0].userId
    });
    return util.send(res);
  } catch (error) {
    util.setError(400, error.message);
    return util.send(res);
  }
};
