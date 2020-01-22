// includs the dependencies
const express = require("express");
const router = express.Router();
const passport = require("passport");

// includs the contollers
const index_controller = require("../controllers/indexController");
const message_controller = require("../controllers/messageController");
const like_controller = require("../controllers/likeController");
const friend_controller = require("../controllers/friendController");
const comment_controller = require("../controllers/commentController");

// saves the current User information
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

// post login
router.post(
  "/login",
  passport.authenticate("local", {
    successRedirect: "/catalog",
    failureRedirect: "/catalog/login"
  })
);

// post accept
router.post("/accept", friend_controller.accept_post);

// post friend
router.post("/friend", friend_controller.friend_post);

//get new message page
router.get("/:id/newmsg", message_controller.newmsg_get);

// post new message
router.post("/:id/newmsg", message_controller.newmsg_post);

router.get("/:id/msgupdate", message_controller.msg_update);

router.post("/:id/msgupdate", message_controller.msg_update_post);

//router.post("/upload", index_controller.upload_post);
router.post("/comment/:id", comment_controller.newcom_post);

//post like
router.post("/post/:id/upvote", like_controller.like_post);

router.get("/:id/editprofile", index_controller.editprofile_get);

router.post("/:id/editprofile", index_controller.editprofile_post);

// get for the profile
router.get("/profile/:id", index_controller.profile_get);

//logout
router.get("/logout", (req, res) => {
  req.logout();
  res.redirect("/");
});
module.exports = router;
