const express = require('express');

const {
  googleLogin,
  googleCallback,
  googleLogout,
} = require('../controllers/oauth.controller');
const passport = require('passport');

const OauthRouter = express.Router();

OauthRouter.get(
  '/google',
  passport.authenticate('google', {
    scope: ['email', 'profile'],
  })
)
  .get(
    '/google/callback',
    passport.authenticate('google', {
      successRedirect: 'http://localhost:3000',
      failureRedirect: '/',
      session: true,
    }),
    (req, res) => {
      console.log('google called us back');
    }
  )
  .get('/google/logout', googleLogout);

module.exports = OauthRouter;
