const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const BadRequest = require('../errors/BadRequest');
const Conflict = require('../errors/Conflict');
const NotFound = require('../errors/NotFound');

const { NODE_ENV, JWT_SECRET = 'my-personal-key' } = process.env;

module.exports.getUsers = (req, res, next) => {
  User.find({})
    .then((users) => res.send({ data: users }))
    .catch(next);
};

module.exports.getUserById = (req, res, next) => {
  const { userId } = req.params;
  User.findById(userId)
    .orFail(new NotFound('Не верно указан id пользователя'))
    .then((user) => {
      res.status(200).send(user);
    })
    .catch((error) => {
      if (error.name === 'CastError') {
        next(new BadRequest('Проверьте корректность введённых данных'));
      } else {
        next(error);
      }
    });
};

module.exports.getUserInfo = (req, res, next) => {
  const userId = req.user._id;
  User.findById(userId)
    .orFail(new NotFound('Указан несуществующий id пользователя'))
    .then((user) => {
      res.status(200).send(user);
    })
    .catch((error) => {
      if (error.name === 'CastError') {
        next(new BadRequest('Проверьте корректность введённых данных'));
      } else {
        next(error);
      }
    });
};

module.exports.createUser = (req, res, next) => {
  const {
    password,
  } = req.body;

  bcrypt.hash(password, 10)
    .then((hash) => {
      User.create({
        ...req.body, password: hash,
      })
        .then((user) => {
          res.send({
            userData: {
              name: user.name,
              about: user.about,
              avatar: user.avatar,
              email: user.email,
            },
          });
        })
        .catch((error) => {
          if (error.name === 'ValidationError') {
            next(new BadRequest('Проверьте корректность введённых данных'));
          } else if (error.code === 11000) {
            next(new Conflict('Пользователь с такой почтой уже зарегестрирован'));
          } else {
            next(error);
          }
        });
    });
};

module.exports.updateProfileUser = (req, res, next) => {
  const { name, about } = req.body;
  User.findOneAndUpdate(
    req.user._id,
    { name, about },
    { new: true, runValidators: true },
  )
    .orFail(new NotFound('Указан несуществующий id пользователя'))
    .then((user) => {
      res.status(200).send(user);
    })
    .catch((error) => {
      if (error.name === 'ValidationError') {
        next(new BadRequest('Проверьте корректность введённых данных'));
      } else {
        next(error);
      }
    });
};

module.exports.updateAvatarUser = (req, res, next) => {
  const { avatar } = req.body;
  User.findByIdAndUpdate(
    req.user._id,
    { avatar },
    { new: true, runValidators: true },
  )
    .orFail(new NotFound('Указан несуществующий id пользователя'))
    .then((user) => {
      res.status(200).send(user);
    })
    .catch((error) => {
      if (error.name === 'ValidationError') {
        next(new BadRequest('Проверьте корректность введённых данных'));
      } else {
        next(error);
      }
    });
};

module.exports.login = (req, res, next) => {
  const { email, password } = req.body;
  User.findUserByCredentials({ email, password })
    .then((user) => {
      const jwtToken = jwt.sign(
        { _id: user._id },
        NODE_ENV === 'production' ? JWT_SECRET : 'my-personal-key',
        { expiresIn: '7d' },
      );

      res.send({ token: jwtToken });
    })
    .catch(next);
};
