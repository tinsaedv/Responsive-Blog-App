const express = require('express');
const {
  registerUser,
  loginUser,
  getUserById,
  getAllUsers,
  follow,
  updateProfile,
  deleteAccount,
  verifyToken,
} = require('../controllers/user.controller');

const UserRouter = express.Router();

UserRouter.post('/register', registerUser)
  .post('/login', loginUser)
  .get('/:id', getUserById)
  .get('/', getAllUsers)
  .get('/follow/:userId/:followerId', verifyToken, follow)
  .post('/updateProfile', updateProfile)
  .delete('/delete/:userId', verifyToken, deleteAccount);

module.exports = UserRouter;
