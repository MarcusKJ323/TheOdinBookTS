const express = require("express");
const router = express.Router();
const passport = require("passport");

const index_controller = require("../controllers/indexController");
const message_controller = require("../controllers/messageController");
const like_controller = require("../controllers/likeController");
const friend_controller = require("../controllers/friendController");
const comment_controller = require("../controllers/commentController");

router.use(function(req, res, next) {
  res.locals.currentUser = req.user;
  next();
});

//Get Homepage
router.get("/", index_controller.index);

//Get Sign up page
router.get("/signup", index_controller.signup_get);

//Post Sign up
router.post("/signup", index_controller.signup_post);

//get Login page
router.get("/login", index_controller.login_get);

router.post(
  "/login",
  passport.authenticate("local", {
    successRedirect: "/",
    failureRedirect: "/catalog/login"
  })
);

router.post("/accept", friend_controller.accept_post);

router.post("/friend", friend_controller.friend_post);

router.get("/:id/newmsg", message_controller.newmsg_get);

router.post("/:id/newmsg", message_controller.newmsg_post);

//router.post("/upload", index_controller.upload_post);

router.post("/comment/:id", comment_controller.newcom_post);

router.post("/post/:id/upvote", like_controller.like_post);

router.get("/profile/:id", index_controller.profile_get);

router.get("/logout", (req, res) => {
  req.logout();
  res.redirect("/");
});
module.exports = router;
