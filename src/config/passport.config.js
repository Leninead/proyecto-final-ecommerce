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
      async function(accessToken, refreshToken, profile, done) {
        try {
            console.log('Profile:', profile);
    
            let userEmail = null;
    
            if (profile.emails && profile.emails.length > 0) {
                userEmail = profile.emails[0].value;
            }
    
            if (!userEmail) {
                console.error('User email not provided by GitHub.');
                // Redirect or render a page for the user to provide their email
                return done(null, false, { message: 'User email not provided by GitHub.' });
            }
    
            // Check if the user is already registered
            let user = await User.findOne({ email: userEmail });
    
            // ... rest of your code
        } catch (error) {
            return done(error);
        }
      }
    )
  );

  // GitHub Strategy
  passport.use(new GitHubStrategy({
    clientID: 'cf5ce53a267057e74936', // Replace with your GitHub client ID
    clientSecret: '9dd5894e8b2f887c3fccef5e458765d2424d6120', // Replace with your GitHub client secret
    callbackURL: "http://localhost:8080/auth/github/callback"
  },
  async function(accessToken, refreshToken, profile, done) {
    try {
      console.log('Profile:', profile);  // Add this line for debugging
  
      let userEmail = profile.emails && profile.emails.length > 0 ? profile.emails[0].value : null;
  
      if (!userEmail) {
        console.error('User email not provided by GitHub.');
        return done(null, false);
      }
  
      // Check if the user is already registered
      let user = await User.findOne({ email: userEmail });
      // ... rest of your code
    } catch (error) {
      return done(error);
    }
  }
));

};

module.exports = initializePassport;

