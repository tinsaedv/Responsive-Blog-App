const express = require('express');
const path = require('path');
const morgan = require('morgan');
const helmet = require('helmet');
const passport = require('passport');
const cookieSession = require('cookie-session');
const cors = require('cors');

const UserRouter = require('./routes/user.routes');
const ArticleRouter = require('./routes/articles.routes');
const CommentRouter = require('./routes/comment.routes');
const OauthRouter = require('./routes/oauth.routes');
const { allowEndpoints } = require('./controllers/oauth.controller');
const GoogleStrategy = require('passport-google-oauth20').Strategy;

const { verifyCallback } = require('./controllers/oauth.controller');
const UploadImageRouter = require('./routes/imageUpload.routes');

const app = express();

require('dotenv').config();

const { CLIENT_ID, CLIENT_SECRET, COOKIE_KEY_1, COOKIE_KEY_2 } = process.env;

app.use(
  cors({
    origin: 'http://localhost:3000',
  })
);

app.use(helmet());

app.use(express.json({ limit: '25mb' }));
app.use(express.urlencoded({ limit: '25mb' }));

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

app.use(
  cookieSession({
    name: 'session',
    maxAge: 24 * 60 * 60 * 1000,
    keys: [config.COOKIE_KEY_1, config.COOKIE_KEY_2],
  })
);

app.use(passport.initialize());
app.use(passport.session());

passport.use(new GoogleStrategy(AUTH_OPTIONS, verifyCallback));

app.use(morgan('tiny'));

app.use('/api/users', UserRouter);
app.use('/api/articles', ArticleRouter);
app.use('/api/comments', CommentRouter);
app.use('/api', UploadImageRouter);
app.use('/auth', OauthRouter);

app.use(express.static(path.join(__dirname, '..', 'public')));

app.get('/*', (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'public', 'index.html'));
});

module.exports = app;
