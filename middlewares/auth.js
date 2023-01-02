const jwt = require('jsonwebtoken');
const InvalidToken = require('../errors/InvalidToken');

const { NODE_ENV, JWT_SECRET = 'my-personal-key' } = process.env;

module.exports.authorization = (req, res, next) => {
  const { authorization } = req.headers;
  let payload;

  try {
    if (!authorization || !authorization.startsWith('Bearer ')) {
      throw new InvalidToken('Аутентификация не пройдена');
    } else {
      const token = authorization.replace('Bearer ', '');
      payload = jwt.verify(token, NODE_ENV === 'production' ? JWT_SECRET : 'my-personal-key');
    }
  } catch (error) {
    next(new InvalidToken('Аутентификация не пройдена'));
  }
  req.user = payload; // записываем пейлоуд в объект запроса
  next(); // пропускаем запрос дальше
};
