// passport.js

const passport = require('passport');
const { Strategy: LocalStrategy } = require('passport-local');
const { Strategy: JwtStrategy, ExtractJwt } = require('passport-jwt');
const { User } = require('../models/user.model');
const { isValidatePassword } = require('../utils/utils.js');
const { JWT_SECRET } = require('../config/config');

function configurePassport() {
  // Local Strategy
  passport.use('login', new LocalStrategy(
    { usernameField: 'email' },
    async function(email, password, done) {
      try {
        const user = await User.findOne({ email: email });

        if (!user) {
          return done(null, false, { message: 'User not found.' });
        }

        const isValidPassword = isValidatePassword(password, user.password);

        if (!isValidPassword) {
          return done(null, false, { message: 'Incorrect password.' });
        }

        return done(null, user);
      } catch (error) {
        return done(error);
      }
    }
  ));

  // JWT Strategy
  const jwtOptions = {
    jwtFromRequest: ExtractJwt.fromExtractors([
      ExtractJwt.fromAuthHeaderAsBearerToken(),
      (req) => req.cookies['jwt'],
    ]),
    secretOrKey: JWT_SECRET,
  };

  console.log(`JWT_SECRET in configurePassport: ${JWT_SECRET}`); // Add this line

  passport.use(new JwtStrategy(jwtOptions, async (jwtPayload, done) => {
    try {
      const user = await User.findById(jwtPayload.id);

      if (user) {
        return done(null, user);
      } else {
        return done(null, false);
      }
    } catch (error) {
      return done(error, false);
    }
  }));
}

// Invoke configurePassport before using passport middleware
configurePassport();

module.exports = passport;
