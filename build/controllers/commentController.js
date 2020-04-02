"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_validator_1 = require("express-validator");
const Comment_1 = __importDefault(require("../models/Comment"));
class CommentController {
    constructor() {
        //post for the a new message
        this.newcom_post = [
            //validates the form
            express_validator_1.check("comment", "Must not be empty")
                .not()
                .isEmpty()
                .isLength({ min: 1, max: 500 })
                .trim(),
            //escapes with wildcard
            express_validator_1.sanitizeBody("*").escape(),
            (req, res, next) => {
                //sperate Errors from req
                const errors = express_validator_1.validationResult(req);
                // creates messge in the db
                const comment = new Comment_1.default({
                    comment: req.body.comment,
                    author: req.user,
                    to: req.params.id
                });
                //checks if there are errors
                if (!errors.isEmpty()) {
                    // There are errors
                    res.render("index", {
                        comment: req.body.comment,
                        errors: errors.array()
                    });
                    res.redirect("/");
                    return;
                }
                else {
                    //Data is vaild
                    comment.save(err => {
                        if (err)
                            return next(err);
                        res.redirect("/");
                    });
                }
            }
        ];
    }
}
exports.CommentController = CommentController;
