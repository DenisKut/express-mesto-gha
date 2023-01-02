const router = require('express').Router();

const {
  getUsers,
  getUserInfo,
  getUserById,
  updateProfileUser,
  updateAvatarUser,
} = require('../controllers/users');

const {
  validateGetUserById,
  validateUpdateProfileUser,
  validateUpdateAvatarUser,
} = require('../middlewares/validateOptions');

router.get('/', getUsers);
router.get('/me', getUserInfo);
router.get('/:userId', validateGetUserById, getUserById);
router.patch('/me', validateUpdateProfileUser, updateProfileUser);
router.patch('/me/avatar', validateUpdateAvatarUser, updateAvatarUser);

module.exports = router;
