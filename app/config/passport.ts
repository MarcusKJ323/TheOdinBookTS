const LocalStrategy = require("passport-local").Strategy;
import passport from "passport";
import bcrypt from "bcryptjs";
import User from "../models/User";

passport.use(
  new LocalStrategy((username: any, password: any, done: any) => {
    User.findOne({ username: username }, (err: any, user: any) => {
      if (err) return done(err);
      if (!user) {
        return done(null, false, { msg: "Incorrect Username" });
      } else {
        //compare the enterd password with the encryted one
        bcrypt.compare(password, user.password, (err: any, res: any) => {
          if (res) {
            //password match
            return done(null, user);
          } else {
            //password do not match
            return done(null, false, { msg: "Incorrect password" });
          }
        });
      }
    });
  })
);
//for the Cookie
passport.serializeUser((user: any, done) => {
  done(null, user.id);
});

passport.deserializeUser((id: any, done: any) => {
  User.findById(id, (err: any, user: any) => {
    done(err, user);
  });
});
