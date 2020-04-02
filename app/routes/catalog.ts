import express from "express";
let router = express.Router();
import passport from "passport";
import multer from "multer";
import { Request, Response, NextFunction } from "express";
const upload = multer({ dest: "./build/public/images" });
import { IndexController } from "../controllers/indexController";
import { MessageController } from "../controllers/messageController";
import { LikeController } from "../controllers/likeController";
import { FriendController } from "../controllers/friendController";
import { CommentController } from "../controllers/commentController";

export class Router_Catalog {
  public indexcontroller: IndexController = new IndexController();
  public messagecontroller: MessageController = new MessageController();
  public likecontroller: LikeController = new LikeController();
  public friendcontroller: FriendController = new FriendController();
  public commentcontroller: CommentController = new CommentController();

  public routes() {
    //Get Homepage
    router.get("/", this.indexcontroller.index);

    //Get Sign up page
    router.get("/signup", this.indexcontroller.signup_get);

    //Post Sign up
    router.post("/signup", this.indexcontroller.signup_post);

    //get Login page
    router.get("/login", this.indexcontroller.login_get);

    // post login
    router.post(
      "/login",
      passport.authenticate("local", {
        successRedirect: "/catalog",
        failureRedirect: "/catalog/login"
      })
    );

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

    router.post(
      "/:id/editprofile",
      upload.single("pic"),
      this.indexcontroller.editprofile_post
    );

    // get for the profile
    router.get("/profile/:id", this.indexcontroller.profile_get);

    //logout
    router.get("/logout", (req: Request, res: Response) => {
      req.logout();
      res.redirect("/");
    });
  }
}
