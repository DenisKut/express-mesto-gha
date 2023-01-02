const express = require('express');
const cors = require('cors');
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
const { authorization } = require('./middlewares/auth');
const auth = require('./routes/auth');
// Слушаем 3000 порт
const { PORT = 3000, DATA_BASE = 'mongodb://localhost:27017/mestodb' } = process.env;

const requestLimiter = rateLimit({
  windowMs: 1000 * 60,
  max: 100,
  message: 'Слишком много запросов подряд!',
});
const wrongPageLimiter = rateLimit({
  windowMs: 1000 * 60,
  max: 2,
  message: 'Поменяйте наконец адрес!',
});

const app = express();

app.use(helmet.hidePoweredBy({ setTo: 'PHP 4.2.0' }));
app.use(helmet.frameguard({ action: 'sameorigin' }));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(helmet.xssFilter());
app.use(helmet.noSniff());
app.use(helmet.dnsPrefetchControl());

app.use(cors());

mongoose.set('strictQuery', true);

app.use(requestLimiter);

app.use('/', auth);
app.use('/users', authorization, users);
app.use('/cards', authorization, cards);
app.use(errors());
app.use(errorHandler);

app.all('*', wrongPageLimiter, (req, res, next) => {
  next(new NotFound('Page Not Found!'));
});

mongoose.connect('mongodb://localhost:27017/mestodb', {
  useNewUrlParser: true,
});

app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
  console.log(`App connect to dateBase ${DATA_BASE}`);
});
