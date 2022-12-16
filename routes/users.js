const router = require('express').Router();

const {
  getUsers,
  getUserById,
  createUser,
  updateProfileUser,
  updateAvatarUser,
} = require('../controllers/users');

router.get('/', getUsers);
router.get('/:userId', getUserById);
router.post('/', createUser);
router.patch('/me', updateProfileUser);
router.patch('/me/avatar', updateAvatarUser);

module.exports = router;
