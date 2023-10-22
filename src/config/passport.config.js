const passport = require('passport');
const { Strategy: LocalStrategy } = require('passport-local');
const { Strategy: JwtStrategy, ExtractJwt } = require('passport-jwt');
const { User } = require('../models/User');
const { isValidatePassword } = require('../utils');
const { JWT_SECRET } = require('../config/config');

const cookieExtractor = (req) => {
  let token = null;
  if (req && req.cookies) {
    token = req.cookies['jwt']; // Assuming your cookie is named 'jwt'
  }
  return token;
};

const configurePassport = () => {
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
      cookieExtractor, // Add the cookieExtractor here
    ]),
    secretOrKey: process.env.JWT_SECRET, // Use process.env.JWT_SECRET here
  };
  
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
module.exports = configurePassport;

