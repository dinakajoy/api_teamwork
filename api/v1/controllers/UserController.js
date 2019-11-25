const Helpers = require('../helper/Helper');
const getUserId = require('../middleware/getUserIdMiddleware');
const UserService = require('../services/UserService');
const Util = require('../utils/Utils');

const util = new Util();

exports.signup = async (request, response) => {
  request.body.password = await Helpers.hashPassword(request.body.password);
  try {
    const user = await UserService.createUser(request.body);
    if (user.error) {
      util.setError(500, user.error);
      return util.send(response);
    }
    const rows = user[0];
    util.setSuccess(201, {
      message: 'User account successfully created',
      token: request.headers.authorization,
      userId: rows.userId,
      isAdmin: rows.isAdmin,
      firstName: rows.firstName,
      lastName: rows.lastName,
      email: rows.email,
      gender: rows.gender,
      jobRole: rows.jobRole,
      department: rows.department,
      address: rows.address
    });
    return util.send(response);
  } catch (error) {
    util.setError(400, error.message);
    return util.send(response);
  }
};

exports.signin = async (request, response) => {
  const { email, password } = request.body;
  try {
    const user = await UserService.getUser(email);
    if (!user || user.error) {
      util.setError(500, user.error);
      return util.send(response);
    }
    if (user.length < 1) {
      util.setError(404, 'User not found');
      return util.send(response);
    }
    const rows = user[0];
    const passwrd = rows.password;
    const pass = await Helpers.comparePassword(password, passwrd);
    if (pass) {
      const token = await Helpers.generateToken(rows.userId);
      util.setSuccess(200, {
        token,
        userId: rows.userId,
        firstName: rows.firstName,
        lastName: rows.lastName,
        email: rows.email,
        picture: rows.picture,
        gender: rows.gender,
        jobRole: rows.jobRole,
        department: rows.department,
        address: rows.address
      });
      return util.send(response);
    }
    util.setError(401, 'Invalid credentials');
    return util.send(response);
  } catch (error) {
    util.setError(400, error.message);
    return util.send(response);
  }
};

exports.getUsers = async (request, response) => {
  try {
    const result = await UserService.getUsers();
    if (result.errors) {
      util.setError(404, result.error);
      return util.send(response);
    }
    if (result.length < 1) {
      util.setError(404, 'No user found');
      return util.send(response);
    }
    util.setSuccess(200, result);
    return util.send(response);
  } catch (error) {
    util.setError(500, error.message);
    return util.send(response);
  }
};

exports.getUser = async (request, response) => {
  const userId = request.params.userId;
  try {
    const result = await UserService.checkUser(userId);
    if (result.error) {
      util.setError(404, result.error);
      return util.send(response);
    }
    if (result.length < 1) {
      util.setError(404, 'User not found');
      return util.send(response);
    }
    const user = result[0];
    util.setSuccess(200, {
      token: request.headers.authorization,
      userId: user.userId,
      isAdmin: user.isAdmin,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      gender: user.gender,
      jobRole: user.jobRole,
      department: user.department,
      address: user.address
    });
    return util.send(response);
  } catch (error) {
    util.setError(500, error.message);
    return util.send(response);
  }
};

exports.changePhoto = async (request, response) => {
  const userId = await getUserId(request);
  if (!request.files) {
    util.setError(415, 'Please upload photo');
    return util.send(response);
  }
  const file = request.files.picture;
  const url = `${request.protocol}://${request.get('host')}`;
  const img = `/api/v1/images/users/${Date.now()}_${file.name}`;
  const filetype = await Helpers.imageType(file, img);
  if (!filetype || filetype === '') {
    util.setError(422, 'Wrong file type');
    return util.send(response);
  }
  const userDetails = ['picture', `${url}${img}`, userId];
  try {
    const result = await UserService.updateUser(userDetails);
    if (!result) {
      util.setError(400, 'Invalid token');
      return util.send(response);
    }
    const user = result[0];
    util.setSuccess(200, {
      message: 'Account successfully updated',
      user
    });
    return util.send(response);
  } catch (error) {
    util.setError(500, error.message);
    return util.send(response);
  }
};

exports.changePassword = async (request, response) => {
  const userId = await getUserId(request);
  try {
    const result = await UserService.getUser(request.body.email);
    if (result.error) {
      util.setError(404, result.error);
      return util.send(response);
    }
    if (!result) {
      util.setError(401, 'Invalid credentials');
      return util.send(response);
    }
    if (result.length < 1) {
      util.setError(404, 'User not found');
      return util.send(response);
    }
    const hash = await Helpers.hashPassword(request.body.password);
    const newDetails = ['password', hash, userId];
    const resp = await UserService.updateUser(newDetails);
    if (!resp) {
      util.setError(400, 'Invalid token');
      return util.send(response);
    }
    const user = resp[0];
    util.setSuccess(200, {
      message: 'Account successfully updated',
      user
    });
    return util.send(response);
  } catch (error) {
    util.setError(500, error.message);
    return util.send(response);
  }
};

exports.editUser = async (request, response) => {
  const userDetails = {
    userId: +request.params.userId,
    isAdmin: request.body.isAdmin,
    firstName: request.body.firstName,
    lastName: request.body.lastName,
    email: request.body.email,
    gender: request.body.gender,
    jobRole: request.body.jobRole,
    department: request.body.department,
    address: request.body.address
  };
  try {
    const result = await UserService.editUser(userDetails);
    if (!result) {
      util.setError(404, 'Not found');
      return util.send(response);
    }
    util.setSuccess(200, userDetails);
    return util.send(response);
  } catch (error) {
    util.setError(500, error.message);
    return util.send(response);
  }
};

exports.deleteUser = async (req, res) => {
  const userId = +req.params.userId;
  try {
    const result = await UserService.deleteUser(userId);
    if (!result) {
      util.setError(404, 'User with id not found');
      return util.send(res);
    }
    const user = result[0];
    util.setSuccess(200, user);
    return util.send(res);
  } catch (error) {
    util.setError(500, error.message);
    return util.send(res);
  }
};
