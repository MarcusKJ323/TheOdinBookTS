const LocalStrategy = require("passport-local").Strategy;
const passport = require("passport");
const bcrypt = require("bcryptjs");
const User = require("../models/User");

passport.use(
  new LocalStrategy((username, password, done) => {
    User.findOne({ username: username }, (err, user) => {
      if (err) return done(err);
      if (!user) {
        return done(null, false, { msg: "Incorrect Username" });
      } else {
        bcrypt.compare("secretpassword", user.password, (err, res) => {
          if (res) {
            //passwords match
            return done(null, user);
          } else {
            console.log(user.password);
            //passwords do not match
            return done(err, false, { msg: "Incorrect password" });
          }
        });
      }
    });
  })
);

passport.serializeUser(function(user, done) {
  done(null, user.id);
});

passport.deserializeUser((id, done) => {
  User.findById(id, (err, user) => {
    done(err, user);
  });
});
