const { check, validationResult, sanitizeBody } = require("express-validator");
const Like = require("../models/Like");
const Message = require("../models/Message");
const async = require("async");

// get new messge page
exports.newmsg_get = (req, res) => {
  res.render("newmsg", { title: "Create a new Message" });
};

//post req for message
exports.newmsg_post = [
  //validate message fields
  check("title", "title must not be empty")
    .not()
    .isEmpty()
    .isLength({ min: 1, max: 250 })
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
    //create message in db
    const message = new Message({
      title: req.body.title,
      content: req.body.content,
      author: req.params.id
    });
    //create like in db
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
        console.log("important");
        if (err) {
          return next(err);
        }
      });
      Message.findOneAndRemove(
        { title: "test", content: "test" },
        (err, res) => {
          console.log("hello");
          if (err) throw err;
          if (res) {
          } else {
            likes.save(err => {
              if (err) {
                return next(err);
              }
            });
          }
        }
      );
    }
    res.redirect("/catalog/profile/" + req.params.id);
  }
];
exports.msg_update = (req, res, next) => {
  async.parallel(
    {
      message: callback => {
        Message.findById(req.params.id, callback);
      }
    },
    (err, results) => {
      if (err) throw err;
      res.render("updatemsg", {
        head: "Update Message",
        title: results.message.title,
        content: results.message.content,
        data: results
      });
    }
  );
};

exports.msg_update_post = [
  check("title", "cant be empty")
    .not()
    .isEmpty()
    .trim(),
  check("content", "cant be empty")
    .not()
    .isEmpty()
    .trim(),

  sanitizeBody("*").escape(),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.render("updatemsg", {
        head: "ERROR",
        title: req.body.title,
        content: req.body.content,
        errors: errors.array()
      });
    } else {
      Message.findByIdAndUpdate(
        req.params.id,
        { title: req.body.title, content: req.body.content },
        (err, data) => {
          if (err) throw err;

          res.redirect("/catalog/profile/" + req.user.id);
        }
      );
    }
  }
];
