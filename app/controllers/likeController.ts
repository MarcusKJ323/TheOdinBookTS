import User from "../models/User";
import Messages from "../models/Message";
import Likes from "../models/Like";
import async from "async";
var count: any = 0;

export class LikeController {
  public like_post = [
    (req: any, res: any, next: any) => {
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
        (err, results: any) => {
          //checks if user already liked the post
          results.liker.forEach(function(element: any) {
            if (element.post == req.params.id) {
              count = 0;
              req.user.likes.forEach(function(like: any) {
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
}
