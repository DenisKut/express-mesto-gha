const express = require('express');
const mongoose = require('mongoose');
const rateLimit = require('express-rate-limit');
const bodyParser = require('body-parser');
const users = require('./routes/users');
const cards = require('./routes/cards');
// Слушаем 3000 порт
const { PORT = 3000 } = process.env;
const app = express();

const requestLimiter = rateLimit({
  windowMs: 1000 * 60,
  max: 36,
  message: 'Слишком много запросов подряд!',
});
const wrongPageLimiter = rateLimit({
  windowMs: 1000 * 60,
  max: 2,
  message: 'Поменяйте наконец адрес!',
});

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

mongoose.connect('mongodb://localhost:27017/mestodb', {
  useNewUrlParser: true,
});
app.use(requestLimiter, (req, res, next) => {
  req.user = {
    _id: '639a3284f57f7a162ada7ae1',
  };

  next();
});

mongoose.set('strictQuery', true);

app.use('/users', requestLimiter, users);
app.use('/cards', requestLimiter, cards);
app.all('*', wrongPageLimiter, (req, res) => {
  res.status(404).send({ message: 'Page Not Found!' });
});

app.listen(PORT);
