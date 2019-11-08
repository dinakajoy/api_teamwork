const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const hpp = require('hpp');
const helmet = require('helmet');
const url = require('url');

// const fs = require('fs');
// const cloudinary = require('cloudinary').v2;
// const multipart = require('connect-multiparty');
// const multipartMiddleware = multipart();

const userRoutes = require('./routes/userRoutes');

const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors());
app.use(hpp());
app.use(helmet());

// cloudinary.config({
//   cloud_name: 'odinaka-joy',
//   api_key: 'process.env.API_KEY',
//   api_secret: 'process.env.API_SECRET',
// });

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

app.use('/api/v1/auth', userRoutes);

// app.get('/', multipartMiddleware, (req, res) => {
app.get('/', (req, res) => {
  res.json({ message: 'YAY! Congratulations! Your Are Connected To Teamwork Api. You Must Be Authorized To Continue!!!' });
});

app.use('/api', (req, res, next) => {
  const path = url.parse(req.url, true);
  const version = path.pathname.split('/');
  if (version[1] !== 'v1') {
    res.json({ message: `Sorry, Version ${version[1]} is not available` });
  } else {
    next();
  }
  res.end();
});

module.exports = app;
