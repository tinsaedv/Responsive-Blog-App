const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const UserModel = require('../models/user.model');

const GOOGLE_CALLBACK_URL = 'http://localhost:4000/auth/google/callback';

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  try {
    const user = await UserModel.findById(id);
    done(null, user);
  } catch (err) {
    done(err, null);
  }
});

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.CLIENT_ID,
      clientSecret: process.env.CLIENT_SECRET,
      callbackURL: GOOGLE_CALLBACK_URL,
      passReqToCallback: true,
    },
    async (req, accessToken, refreshToken, profile, done) => {
      try {
        // Check if user already exists
        let user = await UserModel.findOne({ googleId: profile.id });
        
        if (user) {
          return done(null, user);
        }

        // If user doesn't exist, create new user
        user = await UserModel.create({
          googleId: profile.id,
          email: profile.emails[0].value,
          name: profile.displayName,
          profilePicture: profile.photos[0].value,
          bio: '',
          profession: ''
        });

        return done(null, user);
      } catch (err) {
        console.error('Error in Google Strategy:', err);
        return done(err, null);
      }
    }
  )
);
