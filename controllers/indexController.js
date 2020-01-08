const { check, validationResult, sanitizeBody } = require("express-validator");
const User = require("../models/User");
const Messages = require("../models/Message");
const Comments = require("../models/Comment");
const Likes = require("../models/Like");
const express = require("express");
const bcrypt = require("bcryptjs");
const async = require("async");
require("dotenv").config();

//get index
exports.index = (req, res) => {
  async.parallel(
    {
      allUsers: callback => {
        User.find({}, { _id: 0, __v: 0 }, callback).populate("messages");
      },
      allMessages: callback => {
        Messages.find({}, { _id: 0, __v: 0 }, callback)
          .populate("author")
          .populate("likes");
      },
      id: callback => {
        Messages.find({}, callback)
          .populate("author")
          .populate("likes");
      },
      comments: callback => {
        Comments.find({}, callback);
      },
      likes: callback => {
        Likes.find({}, callback);
      }
    },

    (err, results) => {
      console.log(results.likes.likes);
      if (err) throw err;
      res.render("index", {
        data: results,
        messageid: results.id,
        user: req.user,
        title: "Message Board",
        likes: results.likes.likes
      });
    }
  );
};

//Get Sign up page
exports.signup_get = (req, res) => {
  res.render("signup", { title: "Sign up" });
};

//Post Sign up
exports.signup_post = [
  //Validate the enterd fields
  check("username", "Username must be 3 to 30 chars long, no special chars")
    .trim()
    .not()
    .isEmpty()
    .isLength({ min: 3, max: 30 })
    .isAlpha(),

  check("firstname", "Firstname must be 2 to 20 chars long,no special chars")
    .trim()
    .not()
    .isEmpty()
    .isLength({ min: 2, max: 20 })
    .isAlpha(),

  check("lastname", "Lastname must be 2 to 20 chars long, no special chars")
    .trim()
    .not()
    .isEmpty()
    .isLength({ min: 2, max: 20 })
    .isAlpha(),

  check("password", "Password must be 6 to 50 chars long")
    .trim()
    .not()
    .isEmpty()
    .isLength({ min: 6, max: 50 }),

  check("passwordConfirm", "Passwords do not match")
    .not()
    .isEmpty()
    .exists()
    .custom((value, { req }) => value === req.body.password),

  //sanitize with wildcard
  sanitizeBody("*").escape(),

  //Process request after validation and sanitization
  (req, res, next) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      //There are Errors Render with validated and sanitized data
      res.render("signup", {
        title: "Signup",
        firstname: req.body.firstname,
        lastname: req.body.lastname,
        username: req.body.username,
        errors: errors.array()
      });
      return;
    } else {
      //check if User already exists
      User.findOne({ username: req.body.username }, (err, user) => {
        if (err) {
          res.render("index", { title: "Signup error" });
        }
        if (user) {
          res.render("index", { title: "User does already exits" });
        } else {
          bcrypt.hash("secretpassword", 10, (err, hashedpassword) => {
            if (err) throw err;
            const user = new User({
              firstname: req.body.firstname,
              lastname: req.body.lastname,
              username: req.body.username,
              password: hashedpassword
            });
            user.save(err => {
              if (err) {
                return next(err);
              }
              res.redirect("/");
            });
          });
        }
      });
    }
  }
];

//Get Login page
exports.login_get = (req, res) => {
  res.render("login", { title: "loign" });
};

//exports.login_post = () => {
//  passport.authenticate("local"), () => {};
//  return res.render("index");
//};

//get for profile
exports.profile_get = (req, res, next) => {
  async.parallel(
    {
      user: function(callback) {
        User.findById(req.params.id)
          .populate("messages")
          .exec(callback);
      },
      msg: function(callback) {
        Messages.find({ author: req.params.id }, { _id: 0, __v: 0 }, callback);
      },
      msg_count: function(callback) {
        Messages.countDocuments({ author: req.params.id }, callback);
      }
    },
    function(err, results) {
      if (err) {
        return next(err);
      }
      if (results.user == null) {
        //No results
        var err = new Error("User not found");
        err.status = 404;
        return next(err);
      }
      // console.log(results.user);
      res.render("profile", {
        title: "Hello",
        firstname: results.user.firstname,
        lastname: results.user.lastname,
        messages: results.user.messages,
        username: results.user.username,
        id: results.user._id,
        user: results.user,
        data: results
      });
    }
  );
};
