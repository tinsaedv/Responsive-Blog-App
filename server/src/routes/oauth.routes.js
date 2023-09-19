const express = require('express');
const {
  googleLogin,
  googleCallback,
  googleLogout,
} = require('../controllers/oauth.controller');

const OauthRouter = express.Router();

OauthRouter.get('/google', googleLogin)
  .get('/google/callback', googleCallback)
  .get('/google/logout', googleLogout);

module.exports = OauthRouter;
