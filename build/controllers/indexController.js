"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_validator_1 = require("express-validator");
const User_1 = __importDefault(require("../models/User"));
const Friend_1 = __importDefault(require("../models/Friend"));
const Message_1 = __importDefault(require("../models/Message"));
const Comment_1 = __importDefault(require("../models/Comment"));
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const async_1 = __importDefault(require("async"));
const fs_1 = __importDefault(require("fs"));
const Image_1 = __importDefault(require("../models/Image"));
require("dotenv").config();
class IndexController {
    constructor() {
        this.index = (req, res) => {
            if (req.user !== undefined) {
                //search every db after infromation that you want to display
                async_1.default.parallel({
                    notfrienduser: callback => {
                        User_1.default.find({ friend: { $nin: [req.user.id] } }, callback);
                    },
                    allmessages: callback => {
                        Message_1.default.find({}, callback)
                            .populate("author")
                            .sort({ timeStamp: -1 });
                    },
                    comments: callback => {
                        Comment_1.default.find({}, callback);
                    },
                    Friendsreq: callback => {
                        Friend_1.default.find({ recipient: req.user.id }, callback).populate("requester");
                    },
                    Friendpend: callback => {
                        Friend_1.default.find({ requester: req.user.id, status: 2 }, callback).populate("recipient");
                    },
                    Image: callback => {
                        Image_1.default.find({ author: req.user.id }, callback).populate("author");
                    }
                }, (err, results) => {
                    var avatar = "data:" +
                        results.Image[0].data.Contenttype +
                        ";base64," +
                        results.Image[0].data.data;
                    // renders the indexsite
                    if (err)
                        throw err;
                    res.render("index", {
                        Image: avatar,
                        data: results,
                        title: "Message Board"
                    });
                });
            }
            else {
                res.redirect("/catalog/login");
            }
        };
        this.signup_get = (req, res) => {
            res.render("signup", { title: "Sign up" });
        };
        this.signup_post = [
            //Validate the enterd fields
            express_validator_1.check("username", "Username must be 3 to 30 chars long, no special chars")
                .trim()
                .not()
                .isEmpty()
                .isLength({ min: 3, max: 30 })
                .isAlpha(),
            express_validator_1.check("firstname", "Firstname must be 2 to 20 chars long,no special chars")
                .trim()
                .not()
                .isEmpty()
                .isLength({ min: 2, max: 20 })
                .isAlpha(),
            express_validator_1.check("lastname", "Lastname must be 2 to 20 chars long, no special chars")
                .trim()
                .not()
                .isEmpty()
                .isLength({ min: 2, max: 20 })
                .isAlpha(),
            express_validator_1.check("password", "Password must be 6 to 50 chars long")
                .trim()
                .not()
                .isEmpty()
                .isLength({ min: 6, max: 50 }),
            // custom check for if the passwords are the same
            express_validator_1.check("passwordConfirm", "Passwords do not match")
                .not()
                .isEmpty()
                .exists()
                .custom((value, { req }) => value === req.body.password),
            //sanitize with wildcard
            express_validator_1.sanitizeBody("*").escape(),
            //Process request after validation and sanitization
            (req, res, next) => {
                const errors = express_validator_1.validationResult(req);
                if (!errors.isEmpty()) {
                    //There are Errors Render with validated and sanitized data
                    res.render("signup", {
                        title: "Signup",
                        firstname: req.body.firstname,
                        lastname: req.body.lastname,
                        username: req.body.username,
                        errors: errors.array()
                    });
                    return;
                }
                else {
                    //check if User already exists
                    User_1.default.findOne({ username: req.body.username }, (err, user) => {
                        if (err) {
                            res.render("index", { title: "Signup error" });
                        }
                        if (user) {
                            res.render("index", { title: "User does already exits" });
                        }
                        else {
                            // hashedthe password whit bycrypt
                            bcryptjs_1.default.hash(req.body.password, 10, (err, hash) => {
                                if (err)
                                    throw err;
                                const user = new User_1.default({
                                    firstname: req.body.firstname,
                                    lastname: req.body.lastname,
                                    username: req.body.username,
                                    password: hash
                                });
                                user.save(err => {
                                    if (err) {
                                        return next(err);
                                    }
                                    async_1.default.parallel({
                                        userid: callback => {
                                            User_1.default.find({ username: req.body.username }, callback);
                                        }
                                    }, (err, results) => {
                                        if (err)
                                            throw err;
                                        const pic = "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";
                                        const imgsingup = new Image_1.default({
                                            data: { data: pic, Contenttype: "image/jpeg" },
                                            author: results.userid[0].id
                                        });
                                        // imgsingup.data.data = pic;
                                        // imgsingup.data.Contenttype = "image/jpeg";
                                        // imgsingup.author = results.userid[0].id;
                                        imgsingup.save((err, img) => {
                                            if (err)
                                                throw err;
                                        });
                                    });
                                    User_1.default.findOneAndRemove({ username: "Meier", firstname: "Meier" }, err => {
                                        if (err)
                                            throw err;
                                    });
                                    res.redirect("/");
                                });
                            });
                        }
                    });
                }
            }
        ];
        this.login_get = (req, res) => {
            res.render("login", { title: "login" });
        };
        this.profile_get = (req, res, next) => {
            //search in db after info for profile
            async_1.default.parallel({
                user: callback => {
                    User_1.default.findById(req.params.id)
                        .populate("messages")
                        .exec(callback);
                },
                msg: callback => {
                    Message_1.default.find({ author: req.params.id }, { __v: 0 }, callback).sort({
                        timeStamp: -1
                    });
                },
                msg_count: callback => {
                    Message_1.default.countDocuments({ author: req.params.id }, callback);
                },
                Image: callback => {
                    Image_1.default.find({ author: req.user.id }, callback);
                }
            }, (err, results) => {
                var avatar = "data:" +
                    results.Image[0].data.Contenttype +
                    ";base64," +
                    results.Image[0].data.data;
                if (err) {
                    return next(err);
                } //if no user found print errorr
                if (results.user == null) {
                    //No results
                    var err = new Error("User not found");
                    err.status = 404;
                    return next(err);
                }
                res.render("profile", {
                    Image: avatar,
                    user: results.user,
                    data: results
                });
            });
        };
        this.editprofile_get = (req, res, next) => {
            async_1.default.parallel({
                User: callback => {
                    User_1.default.findById(req.user.id, callback);
                }
            }, (err, results) => {
                if (err)
                    throw err;
                res.render("editprofile", {
                    title: "Edit Profile",
                    firstname: results.User.firstname,
                    lastname: results.User.lastname,
                    username: results.User.username
                });
            });
        };
        this.editprofile_post = [
            express_validator_1.check("firstname", "cant be empty")
                .not()
                .isEmpty()
                .trim(),
            express_validator_1.check("lastname", "cant be empty")
                .not()
                .isEmpty()
                .trim(),
            express_validator_1.check("username", "cant be empty")
                .not()
                .isEmpty()
                .trim(),
            express_validator_1.sanitizeBody("*").escape(),
            (req, res, next) => {
                async_1.default.parallel({
                    image: callback => {
                        Image_1.default.find({ author: req.user.id }, callback).populate("author");
                    }
                }, (err, results) => __awaiter(this, void 0, void 0, function* () {
                    const errors = express_validator_1.validationResult(req);
                    if (!errors.isEmpty()) {
                        res.render("editprofile", {
                            firstname: req.body.firstname,
                            lastname: req.body.lastname,
                            username: req.body.username
                        });
                    }
                    else {
                        User_1.default.findByIdAndUpdate(req.user.id, {
                            firstname: req.body.firstname,
                            lastname: req.body.lastname,
                            username: req.body.username
                        }, (err, data) => {
                            if (err)
                                throw err;
                        });
                        if (req.file) {
                            const imgpath = req.file.path;
                            var imgdata = fs_1.default.readFileSync(imgpath).toString("base64");
                            console.log(imgdata);
                            yield Image_1.default.findOneAndUpdate({ author: req.user.id }, {
                                data: {
                                    data: imgdata,
                                    Contenttype: "image/png"
                                }
                            });
                        }
                        res.redirect("/");
                    }
                }));
            }
        ];
    }
}
exports.IndexController = IndexController;
