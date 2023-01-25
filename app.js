const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const rateLimit = require('express-rate-limit');
const helmet = require('helmet');
const bodyParser = require('body-parser');
require('dotenv').config();
const { errors } = require('celebrate');

const { requestLogger, errorLogger } = require('./middlewares/logger');
const router = require('./routes/routes');
const { errorHandler } = require('./errors/standartError');

// Слушаем 3000 порт
const { PORT = 3000, DATA_BASE = 'mongodb://127.0.0.1:27017/mestodb' } = process.env;

const requestLimiter = rateLimit({
  windowMs: 1000 * 60,
  max: 1000,
  message: 'Слишком много запросов подряд!',
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

app.use(requestLogger);
// краш-тест сервера
app.get('/crash-test', () => {
  setTimeout(() => {
    throw new Error('Сервер сейчас упадёт');
  }, 0);
});

app.use(router);
app.use(errorLogger);

app.use(errors());
app.use(errorHandler);

mongoose.connect(DATA_BASE, {
  useNewUrlParser: true,
});

app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
  console.log(`App connect to dateBase ${DATA_BASE}`);
});
