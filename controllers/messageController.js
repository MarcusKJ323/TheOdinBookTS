const { check, validationResult, sanitizeBody } = require("express-validator");
const User = require("../models/User");
const Like = require("../models/Like");
const Message = require("../models/Message");

exports.newmsg_get = (req, res) => {
  res.render("newmsg", { title: "Create a new Message" });
};

exports.newmsg_post = [
  check("title", "title must not be empty")
    .not()
    .isEmpty()
    .isLength({ min: 1 })
    .trim(),
  check("content", "content must not be empty")
    .isLength({ max: 750 })
    .not()
    .isEmpty()
    .trim(),

  //sanitize Body
  sanitizeBody("*").escape(),

  //move on with requst
  (req, res, next) => {
    const errors = validationResult(req);
    console.log(errors);

    const message = new Message({
      title: req.body.title,
      content: req.body.content,
      author: req.params.id
    });
    console.log(message.id);
    const likes = new Like({
      author: req.params.id,
      post: message.id,
      likes: 0
    });
    if (!errors.isEmpty()) {
      //There are errors.Render again
      res.render("newmsg", {
        title: req.body.title,
        content: req.body.content,
        errors: errors.array()
      });
      return;
    } else {
      //Data is valid
      message.save(err => {
        if (err) {
          return next(err);
        }
        res.redirect("/catalog/profile/" + req.params.id);
      });
      likes.save(err => {
        if (err) {
          return next(err);
        }
      });
    }
  }
];
