const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;

function googleLogin() {
  passport.authenticate('google', {
    scope: ['email', 'profile'],
  });
}

function googleCallback() {
  passport.authenticate('google', {
    successRedirect: '/secret',
    failureRedirect: '/failure',
    session: true,
  });
}

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

function googleLogout(req, res) {
  req.logOut();
  return res.redirect('/');
}

// function allowEndpoints(req, res) {
//   return res.sendFile(path.join(__dirname, '../public/index.html'));
// }

function verifyCallback(accessToken, refreshToken, profile, done) {
  console.log(profile);
  done(null, profile);
}

module.exports = {
  googleLogin,
  googleCallback,
  checkLoggedIn,
  googleLogout,
  verifyCallback,
};
