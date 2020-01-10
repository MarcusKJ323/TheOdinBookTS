const { check, validationResult, sanitizeBody } = require("express-validator");
const User = require("../models/User");
const Messages = require("../models/Message");
const Comments = require("../models/Comment");
const Likes = require("../models/Like");
const express = require("express");
const bcrypt = require("bcryptjs");
const async = require("async");
var count = 0;

exports.like_post = [
  (req, res, next) => {
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
        results.liker.forEach(element => {
          if (element.post == req.params.id) {
            count = 0;
            req.user.likes.forEach(like => {
              console.log(like == req.params.id);
              if (like == req.params.id) {
                count++;
              }
            });
            if (count >= 1) {
            } else {
              console.log(element);
              Likes.findByIdAndUpdate(
                element._id,
                { $inc: { likes: 1 } },
                (err, data) => {
                  if (err) throw err;
                }
              );
              Messages.findByIdAndUpdate(
                element.post,
                { $inc: { likes: 1 } },
                (err, data) => {
                  if (err) throw err;
                }
              );
              User.findByIdAndUpdate(
                req.user.id,
                { $push: { likes: req.params.id } },
                (err, data) => {
                  if (err) throw err;
                }
              );
            }
            console.log(element);
          }
        });
        if (err) return next(err);
      }
    );
    res.redirect("/");
  }
];
