const { celebrate, Joi } = require('celebrate');
const { LINK_REGULAR_EXPRESSION } = require('../utils/utils');

const validateGetUserById = celebrate({
  params: Joi.object().keys({
    userId: Joi.string().required().length(24).hex(),
  }),
});

const validateCreateUser = celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30),
    about: Joi.string().min(2).max(30),
    avatar: Joi.string().pattern(LINK_REGULAR_EXPRESSION),
    email: Joi.string().required().email(),
    password: Joi.string().required(),
  }),
});

const validateUpdateProfileUser = celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30),
    about: Joi.string().min(2).max(30),
  }),
});

const validateUpdateAvatarUser = celebrate({
  body: Joi.object().keys({
    avatar: Joi.string().required().pattern(LINK_REGULAR_EXPRESSION),
  }),
});

const validateLogin = celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required(),
  }),
});

const validateCreateCard = celebrate({
  body: Joi.object().keys({
    name: Joi.string().required().min(2).max(30),
    link: Joi.string().required().pattern(LINK_REGULAR_EXPRESSION),
  }),
});

const validateCardById = celebrate({
  params: Joi.object().keys({
    cardId: Joi.string().required().hex().length(24),
  }),
});

module.exports = {
  validateGetUserById,
  validateCreateUser,
  validateUpdateProfileUser,
  validateUpdateAvatarUser,
  validateLogin,
  validateCreateCard,
  validateCardById,
};
