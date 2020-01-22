//require dependencies
const async = require("async");

//require models
const Friend = require("../models/Friend");
const User = require("../models/User");

//post req for the friendreq
exports.friend_post = [
  (req, res, next) => {
    //searches the db
    async.parallel(
      {
        //searches Userdb with id
        User: callback => {
          User.findById(req.user.id, callback);
        },
        //searches Frienddb with id from requester and recipient
        Friend: callback => {
          Friend.find(
            {
              recipient: req.body.id,
              requester: req.user.id
            },
            callback
          );
        }
      },
      (err, results) => {
        if (err) throw err;
        // if there is no Friendreq create a new one
        if (results.Friend.length != 1) {
          const friend = new Friend({
            requester: req.user.id,
            recipient: req.body.id,
            status: 2
          });

          //saves the friend
          friend.save(err => {
            if (err) return next(err);
          });
          //find User and push id in friends
          User.findByIdAndUpdate(
            req.user.id,
            { $push: { friend: req.body.id } },
            (err, user) => {
              if (err) throw err;
            }
          );
          //does the same but with the recipient
          User.findByIdAndUpdate(
            req.body.id,
            { $push: { friend: req.user.id } },
            (err, user) => {
              if (err) throw err;
            }
          );
        }
      }
    );
    res.redirect("/");
  }
];
// post for accept request
exports.accept_post = [
  (req, res, next) => {
    async.parallel(
      {
        //searches for the request you got send
        Friendaccept: callback => {
          Friend.find(
            { requester: req.body.acceptid, recipient: req.user.id },
            callback
          );
        },
        //serches for an request you send
        Friend2: callback => {
          Friend.find(
            {
              recipient: req.body.acceptid,
              requester: req.user.id
            },
            callback
          );
        }
      },
      (err, results) => {
        if (err) throw err;
        //updates you friend status
        Friend.findByIdAndUpdate(
          results.Friendaccept[0]._id,
          { status: 3 },
          (err, user) => {
            if (err) throw err;
          }
        );
        //creates a friend status for the other one
        if (results.Friend2[0] == undefined) {
          const friend = new Friend({
            requester: req.user.id,
            recipient: req.body.acceptid,
            status: 3
          });
          friend.save(err => {
            if (err) {
              next(err);
            }
          });
        } else {
          // if the friend req already exist update it to 3
          Friend.findByIdAndUpdate(
            results.Friend2[0]._id,
            { status: 3 },
            (err, user) => {
              if (err) throw err;
            }
          );
        }
      }
    );
    res.redirect("/");
  }
];
