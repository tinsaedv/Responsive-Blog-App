const express = require('express');
const {
  postArticle,
  getArticlesByUserId,
  deleteArticleById,
  likeOrDislikeArticle,
  getAllArticles,
  getArticlesById,
  updateArticle,
} = require('../controllers/articles.controller');

const ArticleRouter = express.Router();
ArticleRouter.post('/post', postArticle)
  .put('/update', updateArticle)
  .get('/get', getAllArticles)
  .get('/:articleId', getArticlesById)
  .get('/get/:articleAuthorId', getArticlesByUserId)
  .post('/like', likeOrDislikeArticle)
  .delete('/delete/:articleId', deleteArticleById);

module.exports = ArticleRouter;
