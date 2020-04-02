"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const User_1 = __importDefault(require("../models/User"));
const Message_1 = __importDefault(require("../models/Message"));
const Like_1 = __importDefault(require("../models/Like"));
const async_1 = __importDefault(require("async"));
var count = 0;
class LikeController {
    constructor() {
        this.like_post = [
            (req, res, next) => {
                //search in db for information you need for the likes
                async_1.default.parallel({
                    message: callback => {
                        Message_1.default.find({ _id: req.params.id }, callback).populate("comment");
                    },
                    liker: callback => {
                        Like_1.default.find({}, callback);
                    },
                    savelike: callback => {
                        User_1.default.find({ _id: req.user.id }, callback);
                    }
                }, (err, results) => {
                    //checks if user already liked the post
                    results.liker.forEach(function (element) {
                        if (element.post == req.params.id) {
                            count = 0;
                            req.user.likes.forEach(function (like) {
                                if (like == req.params.id) {
                                    count++;
                                }
                            });
                            if (count >= 1) {
                            }
                            else {
                                //if user didn't like update likes
                                Like_1.default.findByIdAndUpdate(element._id, { $inc: { likes: 1 } }, (err, data) => {
                                    if (err)
                                        throw err;
                                });
                                //same with Messages
                                Message_1.default.findByIdAndUpdate(element.post, { $inc: { likes: 1 } }, (err, data) => {
                                    if (err)
                                        throw err;
                                });
                                //push like in likes
                                User_1.default.findByIdAndUpdate(req.user.id, { $push: { likes: req.params.id } }, (err, data) => {
                                    if (err)
                                        throw err;
                                });
                            }
                        }
                    });
                    if (err)
                        return next(err);
                });
                res.redirect("/");
            }
        ];
    }
}
exports.LikeController = LikeController;
