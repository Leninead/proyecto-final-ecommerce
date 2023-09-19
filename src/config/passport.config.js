const passport = require('passport');
const local = require('passport-local');
const userService = require('../models/User');
const { isValidatePassword } = require('../utils');

const localStrategy = local.Strategy;

const initializePassport = () => {
  passport.use(
    'login',
    new localStrategy(
      { usernameField: 'email' },
      async (username, password, done) => {
        try {
          const user = await userService.findOne({ email: username });

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
};

module.exports = initializePassport;
