const passport = require('passport');
const UserModel = require('../models/user.model');
const GoogleStrategy = require('passport-google-oauth20').Strategy;

function googleLogin() {
  passport.authenticate('google', {
    scope: ['email', 'profile'],
  });
}

function googleCallback() {
  passport.authenticate('google', {
    successRedirect: '/',
    failureRedirect: '/',
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

async function verifyCallback(accessToken, refreshToken, profile, done) {
  try {
    let user = await UserModel.findOne({
      email: profile?._json?.email,
    });

    if (user) {
      return console.log(user);
    }

    if (!user) {
      user = new UserModel({
        profilePicture: profile?._json.picture,
        profilePicturePublicId: '',
        name: profile?.name?.givenName + ' ' + profile?.name?.familyName,
        email: profile?._json?.email,
        bio: '',
        profession: '',
        socials: {
          facebook: '',
          instagram: '',
          linkedIn: '',
          twitter: '',
          github: '',
        },
        google: true,
      });

      await user.save();
    }

    done(null, user);
  } catch (error) {
    console.error(error.message);
    done(error);
  }
}
// console.log(verifyCallback());

module.exports = {
  googleLogin,
  googleCallback,
  checkLoggedIn,
  googleLogout,
  verifyCallback,
};
