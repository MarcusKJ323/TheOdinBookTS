const { check, sanitizeBody, validationResult } = require("express-validator");
const User = require("../models/User");
const Messages = require("../models/Message");
const Comment = require("../models/Comment");

exports.newcom_post = [
  check("comment", "Must not be empty")
    .not()
    .isEmpty()
    .isLength({ min: 1, max: 500 })
    .trim(),

  sanitizeBody("c**").escape(),

  (req, res, next) => {
    //sperate Errors from req
    console.log(req);
    console.log(req.params);
    const errors = validationResult(req);
    console.log(req.user);

    const comment = new Comment({
      comment: req.body.comment,
      author: req.user,
      to: req.params.id
    });
    if (!errors.isEmpty()) {
      console.log(errors);
      // There are errors
      res.render("index", {
        comment: req.body.comment,
        errors: errors.array()
      });
      res.redirect("/");
      return;
    } else {
      //Data is vaild
      comment.save(err => {
        if (err) return next(err);
        res.redirect("/");
      });
    }
  }
];
