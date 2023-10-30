const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;

// Define your user model (e.g., User) and import it

function initializePassport() {
  passport.use(
    new LocalStrategy(
      {
        usernameField: 'email', // Specify the field name for the email in your login form
        passwordField: 'password', // Specify the field name for the password in your login form
      },
      async (email, password, done) => {
        try {
          // Implement your logic to authenticate the user based on the provided email and password
          // You should check the credentials against your user database
          const user = await User.findOne({ email });

          if (!user) {
            return done(null, false, { message: 'Invalid email' });
          }

          if (password !== user.password) {
            return done(null, false, { message: 'Invalid password' });
          }

          return done(null, user);
        } catch (error) {
          return done(error);
        }
      }
    )
  );

  passport.serializeUser((user, done) => {
    done(null, user.id);
  });

  passport.deserializeUser(async (id, done) => {
    try {
      const user = await User.findById(id);
      done(null, user);
    } catch (error) {
      done(error);
    }
  });
}

module.exports = { initializePassport };
