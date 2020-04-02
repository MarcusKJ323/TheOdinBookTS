"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
let router = express_1.default.Router();
const passport_1 = __importDefault(require("passport"));
const multer_1 = __importDefault(require("multer"));
const upload = multer_1.default({ dest: "./build/public/images" });
const indexController_1 = require("../controllers/indexController");
const messageController_1 = require("../controllers/messageController");
const likeController_1 = require("../controllers/likeController");
const friendController_1 = require("../controllers/friendController");
const commentController_1 = require("../controllers/commentController");
class Router_Catalog {
    constructor() {
        this.indexcontroller = new indexController_1.IndexController();
        this.messagecontroller = new messageController_1.MessageController();
        this.likecontroller = new likeController_1.LikeController();
        this.friendcontroller = new friendController_1.FriendController();
        this.commentcontroller = new commentController_1.CommentController();
    }
    routes() {
        //Get Homepage
        router.get("/", this.indexcontroller.index);
        //Get Sign up page
        router.get("/signup", this.indexcontroller.signup_get);
        //Post Sign up
        router.post("/signup", this.indexcontroller.signup_post);
        //get Login page
        router.get("/login", this.indexcontroller.login_get);
        // post login
        router.post("/login", passport_1.default.authenticate("local", {
            successRedirect: "/catalog",
            failureRedirect: "/catalog/login"
        }));
        // post accept
        router.post("/accept", this.friendcontroller.accept_post);
        // post friend
        router.post("/friend", this.friendcontroller.friend_post);
        //get new message page
        router.get("/:id/newmsg", this.messagecontroller.newmsg_get);
        // post new message
        router.post("/:id/newmsg", this.messagecontroller.newmsg_post);
        router.get("/:id/msgupdate", this.messagecontroller.msg_update);
        router.post("/:id/msgupdate", this.messagecontroller.msg_update_post);
        //router.post("/upload", index_controller.upload_post);
        router.post("/comment/:id", this.commentcontroller.newcom_post);
        //post like
        router.post("/post/:id/upvote", this.likecontroller.like_post);
        router.get("/:id/editprofile", this.indexcontroller.editprofile_get);
        router.post("/:id/editprofile", upload.single("pic"), this.indexcontroller.editprofile_post);
        // get for the profile
        router.get("/profile/:id", this.indexcontroller.profile_get);
        //logout
        router.get("/logout", (req, res) => {
            req.logout();
            res.redirect("/");
        });
    }
}
exports.Router_Catalog = Router_Catalog;
