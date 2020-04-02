"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
//require dependencies
const async_1 = __importDefault(require("async"));
//require models
const Friend_1 = __importDefault(require("../models/Friend"));
const User_1 = __importDefault(require("../models/User"));
class FriendController {
    constructor() {
        //post req for the friendreq
        this.friend_post = [
            (req, res, next) => {
                //searches the db
                async_1.default.parallel({
                    //searches Userdb with id
                    User: callback => {
                        User_1.default.findById(req.user.id, callback);
                    },
                    //searches Frienddb with id from requester and recipient
                    Friend: callback => {
                        Friend_1.default.find({
                            recipient: req.body.id,
                            requester: req.user.id
                        }, callback);
                    }
                }, (err, results) => {
                    if (err)
                        throw err;
                    // if there is no Friendreq create a new one
                    if (results.Friend.length != 1) {
                        const friend = new Friend_1.default({
                            requester: req.user.id,
                            recipient: req.body.id,
                            status: 2
                        });
                        //saves the friend
                        friend.save(err => {
                            if (err)
                                return next(err);
                        });
                        //find User and push id in friends
                        User_1.default.findByIdAndUpdate(req.user.id, { $push: { friend: req.body.id } }, (err, user) => {
                            if (err)
                                throw err;
                        });
                        //does the same but with the recipient
                        User_1.default.findByIdAndUpdate(req.body.id, { $push: { friend: req.user.id } }, (err, user) => {
                            if (err)
                                throw err;
                        });
                    }
                });
                res.redirect("/");
            }
        ];
        //}
        //post for accept request
        this.accept_post = [
            (req, res, next) => {
                async_1.default.parallel({
                    //searches for the request you got send
                    Friendaccept: callback => {
                        Friend_1.default.find({ requester: req.body.acceptid, recipient: req.user.id }, callback);
                    },
                    //serches for an request you send
                    Friend2: callback => {
                        Friend_1.default.find({
                            recipient: req.body.acceptid,
                            requester: req.user.id
                        }, callback);
                    }
                }, (err, results) => {
                    if (err)
                        throw err;
                    //updates you friend status
                    Friend_1.default.findByIdAndUpdate(results.Friendaccept[0]._id, { status: 3 }, (err, user) => {
                        if (err)
                            throw err;
                    });
                    //creates a friend status for the other one
                    if (results.Friend2[0] == undefined) {
                        const friend = new Friend_1.default({
                            requester: req.user.id,
                            recipient: req.body.acceptid,
                            status: 3
                        });
                        friend.save(err => {
                            if (err) {
                                next(err);
                            }
                        });
                    }
                    else {
                        // if the friend req already exist update it to 3
                        Friend_1.default.findByIdAndUpdate(results.Friend2[0]._id, { status: 3 }, (err, user) => {
                            if (err)
                                throw err;
                        });
                    }
                });
                res.redirect("/");
            }
        ];
    }
}
exports.FriendController = FriendController;
