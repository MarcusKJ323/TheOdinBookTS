const { check, validationResult, sanitizeBody } = require("express-validator");
const User = require("../models/User");
const Messages = require("../models/Message");
const Comments = require("../models/Comment");
const Likes = require("../models/Like");
const express = require("express");
const bcrypt = require("bcryptjs");
const async = require("async");

exports.like_post = [
  (req, res, next) => {
    // console.log(req.params.id);
    // console.log(req.user);
    async.parallel(
      {
        message: callback => {
          Messages.find({ _id: req.params.id }, callback).populate("comment");
        },
        liker: callback => {
          Likes.find({}, callback);
        },
        iflike: callback => {
          Likes.find({ post: req.params.id }, callback);
        },
        savelike: callback => {
          User.find({ _id: req.user.id }, callback);
        }
      },
      (err, results) => {
        console.log(results.iflike);
        // console.log(req.params.id);
        // console.log(results.liker);
        // console.log(results.liker == req.params.id);
        // console.log(results.savelike);
        // console.log(results.iflike[0]._id);
        results.liker.forEach(element => {
          console.log(element);
          console.log(element.post == req.params.id);
          if (element.post == req.params.id) {
            if (
              req.user.likes.forEach(like => {
                like.post == req.params.id;
              })
            ) {
              // console.log("hallo");
            } else {
              Likes.findByIdAndUpdate(
                element._id,
                { $inc: { likes: 1 } },
                (err, data) => {
                  if (err) throw err;
                  // console.log(data);
                }
              );
              User.findByIdAndUpdate(
                req.user.id,
                { $push: { likes: req.params.id } },
                (err, data) => {
                  if (err) throw err;
                  // console.log(data);
                }
              );
            }
            // console.log(element.likes);
            // console.log(req.user);
          } //  else {
          //   //like does not exits so create like
          //   // const like = new Likes({
          //   //   author: req.user,
          //   //   post: req.params.id,
          //   //   likes: 1
          //   // });
          //   // like.save(err => {
          //   //   if (err) return next(err);
          //   //   res.redirect("/");
          //   // });
          // }
        });
        //check if like exits
        // if (results.iflike) {
        //   //like does not exits so create like
        //   const like = new Likes({
        //     author: req.user,
        //     post: req.params.id,
        //     likes: 1
        //   });
        //   like.save(err => {
        //     if (err) return next(err);
        //     res.redirect("/");
        //   });
        // }
        //like does exits just update the like count

        // console.log(req.user.id);
        // console.log(results.liker.forEach(liker=>{}))
        // console.log(results);
        // console.log(req.params.id);
        if (err) return next(err);

        //     if (results.comment == null) {
        //     //no comment
        //     var err = new Error();
        //     err.status = 404;
        //     return next(err);
        // }
      }
    );

    // console.log(req.params.id);
    // console.log(req);
    res.redirect("/");
  }
];
