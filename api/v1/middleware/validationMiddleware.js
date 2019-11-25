const { body, validationResult } = require('express-validator');

const accountValidationRules = () => {
  return [
    body('isAdmin').isBoolean(),
    body('firstName').isLength({ min: 3 }).trim()
      .escape(),
    body('lastName').isLength({ min: 3 }).trim()
      .escape(),
    body('email').isEmail().normalizeEmail(),
    body('password').isLength({ min: 5 }),
    body('gender').isIn(['male', 'female']).trim().escape(),
    body('jobRole').isLength({ min: 2 }).trim().escape(),
    body('department').isLength({ min: 2 }).trim().escape(),
    body('address').isLength({ min: 2 }).trim().escape()
  ];
};

const accountUpdateValidationRules = () => {
  return [
    body('isAdmin').isBoolean(),
    body('firstName').isLength({ min: 3 }).trim()
      .escape(),
    body('lastName').isLength({ min: 3 }).trim()
      .escape(),
    body('email').isEmail().normalizeEmail(),
    body('gender').isIn(['male', 'female']).trim().escape(),
    body('jobRole').isLength({ min: 2 }).trim().escape(),
    body('department').isLength({ min: 2 }).trim().escape(),
    body('address').isLength({ min: 2 }).trim().escape()
  ];
};


const userValidationRules = () => {
  return [
    body('email').isEmail().normalizeEmail(),
    body('password').isLength({ min: 3 })
  ];
};

const passwordValidationRules = () => {
  return [
    body('email').isEmail().normalizeEmail(),
    body('password').isLength({ min: 3 })
  ];
};

const articleValidationRules = () => {
  return [
    body('categoryId').isNumeric(),
    body('title').isLength({ min: 3 }).trim()
      .escape(),
    body('article').isLength({ min: 3 }).trim()
      .escape()
  ];
};

const commentValidationRules = () => {
  return [
    body('comment').isLength({ min: 3 }).trim()
      .escape()
  ];
};

const categoryValidationRules = () => {
  return [
    body('category').isLength({ min: 3 }).trim()
      .escape()
  ];
};

const gifValidationRules = () => {
  return [
    body('title').isLength({ min: 3 }).trim()
      .escape()
  ];
};

const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (errors.isEmpty()) {
    return next();
  }
  const extractedErrors = [];
  errors.array().map((err) => extractedErrors.push({ [err.param]: err.msg }));

  return res.status(422).json({
    errors: extractedErrors,
  });
};

module.exports = {
  accountValidationRules,
  accountUpdateValidationRules,
  userValidationRules,
  passwordValidationRules,
  articleValidationRules,
  commentValidationRules,
  categoryValidationRules,
  gifValidationRules,
  validate,
};
