//Dependencies
const LocalStrategy = require("passport-local").Strategy;
const passport = require("passport");
const bcrypt = require("bcryptjs");
const User = require("../models/User");

//Function for the authentication
passport.use(
  new LocalStrategy((username, password, done) => {
    User.findOne({ username: username }, (err, user) => {
      if (err) return done(err);
      if (!user) {
        return done(null, false, { msg: "Incorrect Username" });
      } else {
        //compares the enterd password with the encrypted one
        bcrypt.compare(password, user.password, (err, res) => {
          if (res) {
            //passwords match
            return done(null, user);
          } else {
            //passwords do not match
            return done(null, false, { msg: "Incorrect password" });
          }
        });
      }
    });
  })
);
//for the Cookie
passport.serializeUser(function(user, done) {
  done(null, user.id);
});

passport.deserializeUser((id, done) => {
  User.findById(id, (err, user) => {
    done(err, user);
  });
});
