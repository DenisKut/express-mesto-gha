const router = require('express').Router();

const {
  login,
  createUser,
} = require('../controllers/users');

const {
  validateLogin,
  validateCreateUser,
} = require('../middlewares/validateOptions');

router.post('/signin', validateLogin, login);
router.post('/signup', validateCreateUser, createUser);

module.exports = router;
