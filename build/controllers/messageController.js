"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_validator_1 = require("express-validator");
const Like_1 = __importDefault(require("../models/Like"));
const Message_1 = __importDefault(require("../models/Message"));
const async_1 = __importDefault(require("async"));
class MessageController {
    constructor() {
        this.newmsg_get = (req, res) => {
            res.render("newmsg", { title: "Create a new Message" });
        };
        this.newmsg_post = [
            //validate message fields
            express_validator_1.check("title", "title must not be empty")
                .not()
                .isEmpty()
                .isLength({ min: 1, max: 250 })
                .trim(),
            express_validator_1.check("content", "content must not be empty")
                .isLength({ max: 750 })
                .not()
                .isEmpty()
                .trim(),
            //sanitize Body
            express_validator_1.sanitizeBody("*").escape(),
            //move on with requst
            (req, res, next) => {
                const errors = express_validator_1.validationResult(req);
                //create message in db
                const message = new Message_1.default({
                    title: req.body.title,
                    content: req.body.content,
                    author: req.params.id
                });
                //create like in db
                const likes = new Like_1.default({
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
                }
                else {
                    //Data is valid
                    message.save(err => {
                        if (err) {
                            return next(err);
                        }
                    });
                    Message_1.default.findOneAndRemove({ title: "test", content: "test" }, (err, res) => {
                        if (err)
                            throw err;
                        if (res) {
                        }
                        else {
                            likes.save(err => {
                                if (err) {
                                    return next(err);
                                }
                            });
                        }
                    });
                }
                res.redirect("/catalog/profile/" + req.params.id);
            }
        ];
        this.msg_update = (req, res, next) => {
            async_1.default.parallel({
                message: callback => {
                    Message_1.default.findById(req.params.id, callback);
                }
            }, (err, results) => {
                if (err)
                    throw err;
                res.render("updatemsg", {
                    head: "Update Message",
                    title: results.message.title,
                    content: results.message.content,
                    data: results
                });
            });
        };
        this.msg_update_post = [
            express_validator_1.check("title", "cant be empty")
                .not()
                .isEmpty()
                .trim(),
            express_validator_1.check("content", "cant be empty")
                .not()
                .isEmpty()
                .trim(),
            express_validator_1.sanitizeBody("*").escape(),
            (req, res, next) => {
                const errors = express_validator_1.validationResult(req);
                if (!errors.isEmpty()) {
                    res.render("updatemsg", {
                        head: "ERROR",
                        title: req.body.title,
                        content: req.body.content,
                        errors: errors.array()
                    });
                }
                else {
                    Message_1.default.findByIdAndUpdate(req.params.id, { title: req.body.title, content: req.body.content }, (err, data) => {
                        if (err)
                            throw err;
                        res.redirect("/catalog/profile/" + req.user.id);
                    });
                }
            }
        ];
    }
}
exports.MessageController = MessageController;
