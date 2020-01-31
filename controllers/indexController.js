const { check, validationResult, sanitizeBody } = require("express-validator");
const User = require("../models/User");
const Friend = require("../models/Friend");
const Messages = require("../models/Message");
const Comments = require("../models/Comment");
const bcrypt = require("bcryptjs");
const async = require("async");
const multer = require("multer");
require("dotenv").config();

//get index
exports.index = (req, res) => {
  if (req.user !== undefined) {
    //search every db after infromation that you want to display
    async.parallel(
      {
        notfrienduser: callback => {
          User.find({ friend: { $nin: [req.user.id] } }, callback);
        },
        allmessages: callback => {
          Messages.find({}, callback)
            .populate("author")
            .sort({ timeStamp: -1 });
        },
        comments: callback => {
          Comments.find({}, callback);
        },
        Friendsreq: callback => {
          Friend.find({ recipient: req.user.id }, callback).populate(
            "requester"
          );
        },
        Friendpend: callback => {
          Friend.find({ requester: req.user.id, status: 2 }, callback).populate(
            "recipient"
          );
        }
      },

      (err, results) => {
        // renders the indexsite
        if (err) throw err;
        res.render("index", {
          data: results,
          title: "Message Board"
        });
      }
    );
  } else {
    res.redirect("/catalog/login");
  }
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
  // custom check for if the passwords are the same
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
          // hashedthe password whit bycrypt
          bcrypt.hash(req.body.password, 10, (err, hash) => {
            if (err) throw err;
            const user = new User({
              firstname: req.body.firstname,
              lastname: req.body.lastname,
              username: req.body.username,
              password: hash
            });
            user.save(err => {
              if (err) {
                return next(err);
              }
              User.findOneAndRemove(
                { username: "Meier", firstname: "Meier" },
                err => {
                  if (err) throw err;
                }
              );
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
  res.render("login", { title: "login" });
};

//get for profile
exports.profile_get = (req, res, next) => {
  //search in db after info for profile
  async.parallel(
    {
      user: callback => {
        User.findById(req.params.id)
          .populate("messages")
          .exec(callback);
      },
      msg: callback => {
        Messages.find({ author: req.params.id }, { __v: 0 }, callback).sort({
          timeStamp: -1
        });
      },
      msg_count: callback => {
        Messages.countDocuments({ author: req.params.id }, callback);
      }
    },
    (err, results) => {
      if (err) {
        return next(err);
      } //if no user found print errorr
      if (results.user == null) {
        //No results
        var err = new Error("User not found");
        err.status = 404;
        return next(err);
      }
      res.render("profile", {
        title: "Hello",
        user: results.user,
        data: results
      });
    }
  );
};

exports.editprofile_get = (req, res, next) => {
  async.parallel(
    {
      User: callback => {
        User.findById(req.user.id, callback);
      }
    },
    (err, results) => {
      if (err) throw err;
      res.render("editprofile", {
        title: "Edit Profile",
        firstname: results.User.firstname,
        lastname: results.User.lastname,
        username: results.User.username
      });
    }
  );
};

exports.editprofile_post = [
  check("firstname", "cant be empty")
    .not()
    .isEmpty()
    .trim(),
  check("lastname", "cant be empty")
    .not()
    .isEmpty()
    .trim(),
  check("username", "cant be empty")
    .not()
    .isEmpty()
    .trim(),
  sanitizeBody("*").escape(),
  (req, res, next) => {
    console.log(req.file);
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.render("editprofile", {
        firstname: req.body.firstname,
        lastname: req.body.lastname,
        username: req.body.username
      });
    } else {
      User.findByIdAndUpdate(
        req.user.id,
        {
          firstname: req.body.firstname,
          lastname: req.body.lastname,
          username: req.body.username
        },
        (err, data) => {
          if (err) throw err;
        }
      );
      res.redirect("/catalog/profile/" + req.user.id);
    }
  }
];
