const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const hpp = require('hpp');
const helmet = require('helmet');
const url = require('url');
const fileupload = require('express-fileupload');

const app = express();
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cors());
app.use(hpp());
app.use(helmet());
app.use(fileupload({
  useTempFiles: true,
  createParentPath: true,
  safeFileNames: true,
  preserveExtension: true
}));

const userRoutes = require('./v1/routes/userRoutes');
const gifRoutes = require('./v1/routes/gifRoutes');
const categoryRoutes = require('./v1/routes/categoryRoutes');
const articleRoutes = require('./v1/routes/articleRoutes');

app.options('/*', (req, res) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Origin, Content, Accept, Content-Type, Authorization, Content-Length, X-Requested-With');
  res.sendStatus(200);
});
app.all('*', (req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  next();
});

app.get('/', (req, res) => {
  res.status(200).json({ message: 'YAY! Congratulations! Your Are Connected To Teamwork Api. But, You Must Be Authorized To Continue!!!' });
});

/* * Application Routes For All Resources * */
app.use('/api/v1/auth', userRoutes);
app.use('/api/v1/gifs', gifRoutes);
app.use('/api/v1/categories', categoryRoutes);
app.use('/api/v1/articles', articleRoutes);

/* * Checks for use of wrong version in url and flags error * */
app.use('/api', (req, res, next) => {
  const reqPath = url.parse(req.url, true);
  const version = reqPath.pathname.split('/');
  if (version[1] !== 'v1') {
    res.status(505).json({ message: `Sorry, Version ${version[1]} is not available` });
  } else {
    next();
  }
  res.end();
});

module.exports = app;
