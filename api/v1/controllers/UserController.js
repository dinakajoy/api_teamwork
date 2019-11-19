const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const getUserId = require('../middleware/getUserIdMiddleware');
require('dotenv').config();

const UserService = require('../services/UserService');
const Util = require('../utils/Utils');

const util = new Util();

exports.signup = async (req, res) => {
  const hash = bcrypt.hashSync(req.body.password, bcrypt.genSaltSync(8));
  const newUser = {
    isAdmin: req.body.isAdmin,
    firstName: req.body.firstName,
    lastName: req.body.lastName,
    email: req.body.email,
    password: hash,
    gender: req.body.gender,
    jobRole: req.body.jobRole,
    department: req.body.department,
    address: req.body.address
  };
  try {
    const result = await UserService.addUser(newUser);
    util.setSuccess(201, {
      message: 'User account successfully created',
      token: req.headers.authorization,
      userId: result.userId,
      firstName: result.firstName,
      lastName: result.lastName,
      email: result.email,
      gender: result.gender,
      jobRole: result.jobRole,
      department: result.department,
      address: result.address
    });
    return util.send(res);
  } catch (error) {
    util.setError(500, error.message);
    return util.send(res);
  }
};

exports.signin = async (req, res) => {
  const userDetails = {
    email: req.body.email,
    password: req.body.password
  };
  try {
    const user = await UserService.getUser(userDetails.email);
    if (!user) {
      util.setError(404, 'Sorry, your email does not exist!');
      return util.send(res);
    }
    const passwrd = user.password;
    return bcrypt.compare(userDetails.password, passwrd).then((result) => {
      if (!result) {
        util.setError(400, 'Incorrect password!');
        return util.send(res);
      }
      const token = jwt.sign(
        { userId: user.userId },
        process.env.SECRET_TOKEN,
        { expiresIn: '24h' }
      );
      util.setSuccess(200, {
        token,
        userId: user.userId,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        picture: user.picture,
        gender: user.gender,
        jobRole: result.jobRole,
        department: user.department,
        address: user.address
      });
      return util.send(res);
    }).catch((error) => {
      util.setError(401, error.message);
      return util.send(res);
    });
  } catch (error) {
    util.setError(500, error.message);
    return util.send(res);
  }
};

exports.editUser = async (req, res) => {
  const userDetails = {
    userId: +req.params.userId,
    isAdmin: req.body.isAdmin,
    firstName: req.body.firstName,
    lastName: req.body.lastName,
    email: req.body.email,
    gender: req.body.gender,
    jobRole: req.body.jobRole,
    department: req.body.department,
    address: req.body.address
  };
  try {
    const result = await UserService.editUser(userDetails);
    util.setSuccess(200, result);
    return util.send(res);
  } catch (error) {
    util.setError(500, error.message);
    return util.send(res);
  }
};

exports.deleteUser = async (req, res) => {
  const userId = +req.params.userId;
  try {
    const result = await UserService.deleteUser(userId);
    util.setSuccess(200, result);
    return util.send(res);
  } catch (error) {
    util.setError(500, error.message);
    return util.send(res);
  }
};

exports.changePhoto = async (req, res) => {
  if (!req.files) {
    util.setError(200, 'Please upload photo');
    return util.send(res);
  }
  const userId = await getUserId(req);
  const file = req.files.picture;
  const mimetype = file.mimetype;
  let filetype;
  switch (mimetype) {
    case 'image/jpg':
      filetype = 'jpg';
      break;
    case 'image/jpeg':
      filetype = 'jpg';
      break;
    case 'image/png':
      filetype = 'png';
      break;
    default:
      filetype = '';
      break;
  }
  if (!filetype || filetype === '') {
    util.setError(422, 'Wrong file type');
    return util.send(res);
  }
  file.name.split(' ').join('');
  const url = `${req.protocol}://${req.get('host')}`;
  const img = `/api/v1/images/users/${Date.now()}_${file.name}`;
  const userDetails = {
    picture: `${url}${img}`,
    userId
  };
  try {
    const result = await UserService.changePhoto(userDetails);
    if (!result) {
      util.setError(400, 'Sorry, there was an error');
      return util.send(res);
    }
    file.mv(`.${img}`, (err) => {
      if (err) {
        util.setError(err.statusCode, 'Could Not Upload Image');
        return util.send(res);
      }
      return file;
    });
    util.setSuccess(200, result);
    return util.send(res);
  } catch (error) {
    util.setError(500, error.message);
    return util.send(res);
  }
};

exports.changePassword = async (req, res) => {
  const userId = await getUserId(req);
  const userDetails = {
    userId,
    email: req.body.email,
    password: req.body.password
  };
  try {
    const check = await UserService.getUser(userDetails.email);
    if (!check) {
      util.setError(404, 'Sorry, your email does not exist!');
      return util.send(res);
    }
    const hash = bcrypt.hashSync(userDetails.password, bcrypt.genSaltSync(8));
    const newDetails = { userId, password: hash };
    const resp = await UserService.changePassword(newDetails);
    util.setSuccess(200, resp);
    return util.send(res);
  } catch (error) {
    util.setError(500, error.message);
    return util.send(res);
  }
};
