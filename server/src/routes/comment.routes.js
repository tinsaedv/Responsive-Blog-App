const express = require('express');

const CommentRouter = express.Router();

const {
  postComment,
  updateComment,
  deleteComment,
  getCommentsByArticleId,
} = require('../controllers/comment.controller');

CommentRouter.post('/post', postComment)
  .get('/get/:articleId', getCommentsByArticleId)
  .put('/update', updateComment)
  .delete('/delete/:commentId', deleteComment);

module.exports = CommentRouter;
