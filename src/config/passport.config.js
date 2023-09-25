const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const GitHubStrategy = require('passport-github').Strategy;
const User = require('../models/User');
const { isValidatePassword } = require('../utils');

const initializePassport = () => {
  passport.use(
    'login',
    new LocalStrategy(
      { usernameField: 'email' },
      async (username, password, done) => {
        try {
          const user = await User.findOne({ email: username });

          if (!user) {
            console.log('User not found');
            return done(null, false);
          }

          const isPasswordValid = isValidatePassword(password, user.password);

          if (!isPasswordValid) {
            console.log('Invalid password');
            return done(null, false);
          }

          return done(null, user);
        } catch (error) {
          console.error('Error during login: ', error);
          return done('Error during login');
        }
      }
    )
  );

  // GitHub Strategy
  passport.use(new GitHubStrategy({
    clientID: GITHUB_CLIENT_ID,
    clientSecret: GITHUB_CLIENT_SECRET,
    callbackURL: "http://localhost:3000/auth/github/callback"
  },
  function(accessToken, refreshToken, profile, done) {
    // Use the GitHub profile information to create or authenticate the user
    return done(null, profile);
  }
  ));
};

module.exports = initializePassport;
