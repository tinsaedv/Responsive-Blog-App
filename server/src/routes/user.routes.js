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
  .get('/follow/:userId/:followerId', follow)
  .post('/updateProfile', updateProfile)
  .delete('/delete/:userId', deleteAccount);

module.exports = UserRouter;
