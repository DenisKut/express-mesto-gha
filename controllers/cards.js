const Card = require('../models/card');

module.exports.getCards = (req, res) => {
  Card.find({})
    .populate('owner', 'likes')
    .then((cards) => res
      .send(cards))
    .catch(() => {
      res.status(500)
        .send({ message: 'Ошибка выполнения запроса на сервере' });
    });
};

module.exports.createCard = (req, res) => {
  // _id станет доступен
  const { name, link } = req.body;
  const owner = req.user._id;
  Card.create({ owner, name, link })
    .then((card) => {
      res.send(card);
    })
    .catch((error) => {
      if (error.name === 'ValidationError') {
        res.status(400)
          .send({ message: 'Проверьте корректность введённых данных' });
      } else {
        res.status(500)
          .send({ message: 'Ошибка выполнения запроса на сервере' });
      }
    });
};

module.exports.deleteCard = (req, res) => {
  const { cardId } = req.params;
  Card.findByIdAndDelete(cardId)
    .then((card) => {
      if (!card) {
        res.status(404)
          .send({ message: 'Данная карточка не найдена' });
        return;
      }
      res.send(card);
    })
    .catch((error) => {
      if (error.name === 'CastError') {
        res.status(400)
          .send({ message: 'Проверьте корректность введённых данных' });
      } else {
        res.status(500)
          .send({ message: 'Ошибка выполнения запроса на сервере' });
      }
    });
};

module.exports.likeCard = (req, res) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $addToSet: { likes: req.user._id } }, // добавить _id в массив, если его там нет
    { new: true },
  )
    .populate('owner', 'likes')
    .then((card) => {
      if (!card) {
        res.status(404)
          .send({ message: 'Данная карточка не найдена' });
        return;
      }
      res.send(card);
    })
    .catch((error) => {
      if (error.name === 'CastError') {
        res.status(400)
          .send({ message: 'Проверьте корректность введённых данных' });
      } else {
        res.status(500)
          .send({ message: 'Ошибка выполнения запроса на сервере' });
      }
    });
};

module.exports.dislikeCard = (req, res) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $pull: { likes: req.user._id } }, // убрать _id из массива
    { new: true },
  )
    .populate('owner', 'likes')
    .then((card) => {
      if (!card) {
        res.status(404)
          .send({ message: 'Данная карточка не найдена' });
        return;
      }
      res.send(card);
    })
    .catch((error) => {
      if (error.name === 'CastError') {
        res.status(400)
          .send({ message: 'Проверьте корректность введённых данных' });
      } else {
        res.status(500)
          .send({ message: 'Ошибка выполнения запроса на сервере' });
      }
    });
};
