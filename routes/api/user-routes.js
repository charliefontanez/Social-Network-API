const router = require('express').Router();

const {
  getAllUsers,
  getUserById,
  createUser,
  updateUser,
  removeUser,
  getUsersFriends,
  addFriend
} = require('../../controllers/user-controller');

router.route('/').get(getAllUsers).post(createUser);

router.route('/:userId').get(getUserById).put(updateUser).delete(removeUser);

router.route('/:userId/friends/').get(getUsersFriends);
router.route('/:userId/friends/:friendId').post(addFriend);

module.exports = router;
