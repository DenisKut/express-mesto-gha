const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
// Слушаем 3000 порт
const { PORT = 3000 } = process.env;
const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

mongoose.connect('mongodb://localhost:27017/mestodb', {
  useNewUrlParser: true
});
app.use((req, res, next) => {
  req.user = {
    _id: '639a3284f57f7a162ada7ae1',
  };

  next();
});

mongoose.set('strictQuery', true);

app.use('/users', require('./routes/users'));
app.use('/cards', require('./routes/cards'));
app.all('*', (req, res) => {
	res.status(404)
		.send({message: 'Page Not Found!'});
})

app.listen(PORT, () => {
  // Если всё работает, консоль покажет, какой порт приложение слушает
  console.log(`App listening on port ${PORT}`);
});
