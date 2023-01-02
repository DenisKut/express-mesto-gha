const router = require('express').Router();
const { authorization } = require('../middlewares/auth');
const auth = require('./auth');
const users = require('./users');
const cards = require('./cards');
const NotFound = require('../errors/NotFound');

router.use('/', auth);
router.use('/users', authorization, users);
router.use('/cards', authorization, cards);

router.use('*', (req, res, next) => {
  next(new NotFound('Page Not Found!'));
});

module.exports = router;
