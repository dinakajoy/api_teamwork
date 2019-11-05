const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const hpp = require('hpp');
const helmet = require('helmet');

const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors());
app.use(hpp());
app.use(helmet());

app.get('/', (req, res) => {
  res.json({ message: 'YAY! Congratulations! Your Are Connected To Teamwork Api. You Must Be Authorized To Continue!!!' });
});

module.exports = app;
