const User = require("../models/User");
const async = require("async");
const Friend = require("../models/Friend");

exports.friend_post = [
  (req, res, next) => {
    async.parallel(
      {
        User: callback => {
          User.findById(req.user.id, callback);
        },
        Friend: callback => {
          Friend.find(
            { recipient: req.body.id, requester: req.user.id },
            callback
          );
        }
      },
      (err, results) => {
        if (err) throw err;
        if (results.Friend.length != 1) {
          const friend = new Friend({
            requester: req.user.id,
            recipient: req.body.id,
            status: 2
          });
          friend.save(err => {
            if (err) {
              return next(err);
            }
          });
        } else {
          if (results.Friend[0].recipient == req.user.id) {
          }
        }

        User.findByIdAndUpdate(
          req.user.id,
          { $push: { friend: req.body.id } },
          (err, user) => {
            if (err) throw err;
          }
        );
      }
    );
  }
];
