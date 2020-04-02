"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const LocalStrategy = require("passport-local").Strategy;
const passport_1 = __importDefault(require("passport"));
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const User_1 = __importDefault(require("../models/User"));
passport_1.default.use(new LocalStrategy((username, password, done) => {
    User_1.default.findOne({ username: username }, (err, user) => {
        if (err)
            return done(err);
        if (!user) {
            return done(null, false, { msg: "Incorrect Username" });
        }
        else {
            //compare the enterd password with the encryted one
            bcryptjs_1.default.compare(password, user.password, (err, res) => {
                if (res) {
                    //password match
                    return done(null, user);
                }
                else {
                    //password do not match
                    return done(null, false, { msg: "Incorrect password" });
                }
            });
        }
    });
}));
//for the Cookie
passport_1.default.serializeUser((user, done) => {
    done(null, user.id);
});
passport_1.default.deserializeUser((id, done) => {
    User_1.default.findById(id, (err, user) => {
        done(err, user);
    });
});
