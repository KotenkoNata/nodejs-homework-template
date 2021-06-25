const express = require('express');
const logger = require('morgan');
const cors = require('cors');
require('dotenv').config();
const path = require('path');
const AVATAR_OF_USERS = process.env.AVATAR_OF_USERS;

const app = express();

const formatsLogger = app.get('env') === 'development' ? 'dev' : 'short';

app.use(express.static(path.join(__dirname, AVATAR_OF_USERS)));
app.use(logger(formatsLogger));
app.use(cors());
app.use(express.json());

app.use('/api/users', require('./routes/api/users'));
app.use('/api/contacts', require('./routes/api/contacts/contacts'));

app.use((req, res) => {
  res.status(404).json({ status: 'error', code: 404, message: 'Not found' });
});

app.use((err, req, res, next) => {
  const status = err.status || 500;
  res.status(status).json({
    status: status === 500 ? 'fail' : 'error',
    code: 500,
    message: err.message,
  });
});

module.exports = app;
