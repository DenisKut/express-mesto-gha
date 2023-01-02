const express = require('express');
const mongoose = require('mongoose');
const rateLimit = require('express-rate-limit');
const helmet = require('helmet');
const bodyParser = require('body-parser');
require('dotenv').config();
const { errors } = require('celebrate');

const { NotFound } = require('./errors/NotFound');
const { errorHandler } = require('./errors/standartError');
const users = require('./routes/users');
const cards = require('./routes/cards');
const { authMiddleware } = require('./middlewares/auth');
const auth = require('./routes/auth');
// Слушаем 3000 порт
const { PORT = 3000 } = process.env;
const app = express();

const requestLimiter = rateLimit({
  windowMs: 1000 * 60,
  max: 75,
  message: 'Слишком много запросов подряд!',
});
const wrongPageLimiter = rateLimit({
  windowMs: 1000 * 60,
  max: 2,
  message: 'Поменяйте наконец адрес!',
});

app.use(helmet.hidePoweredBy({ setTo: 'PHP 4.2.0' }));
app.use(helmet.frameguard({ action: 'sameorigin' }));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(helmet.xssFilter());
app.use(helmet.noSniff());
app.use(helmet.dnsPrefetchControl());

mongoose.connect('mongodb://localhost:27017/mestodb', {
  useNewUrlParser: true,
});

mongoose.set('strictQuery', true);

app.use('/', auth);
app.use('/users', requestLimiter, authMiddleware, users);
app.use('/cards', requestLimiter, authMiddleware, cards);
app.use(errors());
app.use(errorHandler);

app.all('*', wrongPageLimiter, (req, res, next) => {
  next(new NotFound('Page Not Found!'));
});

app.listen(PORT);
