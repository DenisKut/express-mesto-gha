const Card = require('../models/card');
const BadRequest = require('../errors/BadRequest');
const HaveNotAccessed = require('../errors/HaveNotAccessed');
const NotFound = require('../errors/NotFound');

module.exports.getCards = (req, res, next) => {
  Card.find({})
    .populate('owner', 'likes')
    .then((cards) => res
      .send(cards))
    .catch(next);
};

module.exports.createCard = (req, res, next) => {
  // _id станет доступен
  const { name, link } = req.body;
  const owner = req.user._id;
  Card.create({ owner, name, link })
    .then((card) => {
      res.status(200).send(card);
    })
    .catch((error) => {
      if (error.name === 'ValidationError') {
        next(new BadRequest('Проверьте корректность введённых данных'));
      } else {
        next(error);
      }
    });
};

module.exports.deleteCard = (req, res, next) => {
  const userId = req.user._id;
  const { cardId } = req.params;
  Card.findById(cardId)
    .orFail(() => next(new NotFound('Данной карточки не существует')))
    .then((card) => {
      if (!card.owner.equals(userId)) {
        throw new HaveNotAccessed('Попытка удаления чужой карточки');
      } else {
        card.delete();
        res.status(200).send(card, { message: 'Данная карточка удалена' });
      }
    })
    .catch((error) => {
      if (error.name === 'CastError') {
        next(new BadRequest('Проверьте корректность введённых данных'));
      } else {
        next(error);
      }
    });
};

module.exports.likeCard = (req, res, next) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $addToSet: { likes: req.user._id } }, // добавить _id в массив, если его там нет
    { new: true },
  )
    .populate('owner', 'likes')
    .orFail(() => next(new NotFound('Данной карточки не существует')))
    .then((card) => {
      res.status(200).send(card);
    })
    .catch((error) => {
      if (error.name === 'CastError') {
        next(new BadRequest('Проверьте корректность введённых данных'));
      } else {
        next(error);
      }
    });
};

module.exports.dislikeCard = (req, res, next) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $pull: { likes: req.user._id } }, // убрать _id из массива
    { new: true },
  )
    .populate('owner', 'likes')
    .orFail(() => next(new NotFound('Данной карточки не существует')))
    .then((card) => {
      res.status(200).send(card);
    })
    .catch((error) => {
      if (error.name === 'CastError') {
        next(new BadRequest('Проверьте корректность введённых данных'));
      } else {
        next(error);
      }
    });
};
