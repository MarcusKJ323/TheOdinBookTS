require("dotenv").config();
const bcrypt = require("bcryptjs");
const express = require("express");
const path = require("path");
const session = require("express-session");
const passport = require("passport");
const mongoose = require("mongoose");
var cookieParser = require("cookie-parser");
var logger = require("morgan");
const LocalStrategy = require("passport-local").Strategy;
const router = express.Router();

/* GET users listing. */
router.get("/", function(req, res, next) {
  res.send("respond with a resource");
});

module.exports = router;
