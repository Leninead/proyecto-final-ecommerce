// passport.js

const passport = require('passport');
const { Strategy: LocalStrategy } = require('passport-local');
const { Strategy: JwtStrategy, ExtractJwt } = require('passport-jwt');
const { User } = require('../models/user.model');
const { isValidatePassword } = require('../utils/utils.js');
const { jwtSecret } = require('../generate-secret');


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
    secretOrKey: jwtSecret, // Use jwtSecret instead of JWT_SECRET
  };
  
  console.log(`jwtSecret in configurePassport: ${jwtSecret}`);
 // Add this line

  passport.use(new JwtStrategy(jwtOptions, async (jwtPayload, done) => {
    try {
      const user = await User.findById(jwtPayload.id);
  
      if (user) {
        return done(null, user);
      } else {
        return done(null, false, { message: 'User not found' });
      }
    } catch (error) {
      return done(error, false, { message: 'Error finding user' });
    }
  }));
  
}

// Invoke configurePassport before using passport middleware
configurePassport();

module.exports = passport;
