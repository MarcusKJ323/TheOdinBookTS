const { check, sanitizeBody, validationResult } = require("express-validator");
const Comment = require("../models/Comment");

//post for the a new message
exports.newcom_post = [
  //validates the form
  check("comment", "Must not be empty")
    .not()
    .isEmpty()
    .isLength({ min: 1, max: 500 })
    .trim(),
  //escapes with wildcard
  sanitizeBody("*").escape(),

  (req, res, next) => {
    //sperate Errors from req
    const errors = validationResult(req);
    // creates messge in the db
    const comment = new Comment({
      comment: req.body.comment,
      author: req.user,
      to: req.params.id
    });
    //checks if there are errors
    if (!errors.isEmpty()) {
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
