const User = require("../models/User");
const Messages = require("../models/Message");
const Likes = require("../models/Like");
const async = require("async");
var count = 0;

exports.like_post = [
  (req, res, next) => {
    //search in db for information you need for the likes
    async.parallel(
      {
        message: callback => {
          Messages.find({ _id: req.params.id }, callback).populate("comment");
        },
        liker: callback => {
          Likes.find({}, callback);
        },
        savelike: callback => {
          User.find({ _id: req.user.id }, callback);
        }
      },
      (err, results) => {
        //checks if user already liked the post
        results.liker.forEach(element => {
          if (element.post == req.params.id) {
            count = 0;
            req.user.likes.forEach(like => {
              if (like == req.params.id) {
                count++;
              }
            });
            if (count >= 1) {
            } else {
              //if user didn't like update likes
              Likes.findByIdAndUpdate(
                element._id,
                { $inc: { likes: 1 } },
                (err, data) => {
                  if (err) throw err;
                }
              );
              //same with Messages
              Messages.findByIdAndUpdate(
                element.post,
                { $inc: { likes: 1 } },
                (err, data) => {
                  if (err) throw err;
                }
              );
              //push like in likes
              User.findByIdAndUpdate(
                req.user.id,
                { $push: { likes: req.params.id } },
                (err, data) => {
                  if (err) throw err;
                }
              );
            }
          }
        });
        if (err) return next(err);
      }
    );
    res.redirect("/");
  }
];
