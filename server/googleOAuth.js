const fs = require('fs');
const path = require('path');
const https = require('https');
const express = require('express');
const helmet = require('helmet');
const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const cookieSession = require('cookie-session');

require('dotenv').config();

const { CLIENT_ID, CLIENT_SECRET, COOKIE_KEY_1, COOKIE_KEY_2 } = process.env;

const config = {
  CLIENT_ID: CLIENT_ID,
  CLIENT_SECRET: CLIENT_SECRET,
  COOKIE_KEY_1: COOKIE_KEY_1,
  COOKIE_KEY_2: COOKIE_KEY_2,
};

const AUTH_OPTIONS = {
  callbackURL: '/auth/google/callback',
  clientID: config.CLIENT_ID,
  clientSecret: config.CLIENT_SECRET,
};

//save the session to the cookie
passport.serializeUser((user, done) => {
  done(null, user.id);
}); //req.user

//read the session from the cookie
passport.deserializeUser((id, done) => {
  // User.findById(id).then((user) => {
  //   done(null, user);
  // });
  done(null, id);
});

const app = express();

app.use(helmet());

app.use(
  cookieSession({
    name: 'session',
    maxAge: 24 * 60 * 60 * 1000,
    keys: [config.COOKIE_KEY_1, config.COOKIE_KEY_2],
  })
);

app.use(passport.initialize());
app.use(passport.session());

function verifyCallback(accessToken, refreshToken, profile, done) {
  console.log(profile);
  done(null, profile);
}

passport.use(new GoogleStrategy(AUTH_OPTIONS, verifyCallback));

app.get(
  '/auth/google',
  passport.authenticate('google', {
    scope: ['email', 'profile'],
  })
);

app.get(
  '/auth/google/callback',
  passport.authenticate('google', {
    successRedirect: '/secret',
    failureRedirect: '/failure',
    session: true,
  })
);

function checkLoggedIn(req, res, next) {
  console.log('Current user is:', req.user);
  let isLoggedIn = req.isAuthenticated() && req.user;
  if (!isLoggedIn) {
    return res.status(401).json({
      error: 'You must login!',
    });
  }
  next();
}

app.get('/auth/logout', (req, res) => {
  req.logOut();
  return res.redirect('/');
});

app.get('/secret', checkLoggedIn, (req, res) => {
  return res.send('Your secret key is 32!');
});

app.get('/failure', (req, res) => {
  return res.send('You have not logged in!');
});

app.get('/*', (req, res) => {
  return res.sendFile(path.join(__dirname, '../dist/index.html'));
});

//setup server
const PORT = process.env.PORT || 3000;

const server = https.createServer(
  {
    key: fs.readFileSync('key.pem'),
    cert: fs.readFileSync('cert.pem'),
  },
  app
);

server.listen(PORT, () => {
  console.log(`Listening on port ${PORT}`);
});
