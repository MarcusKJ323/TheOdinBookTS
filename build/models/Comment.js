"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose = require("mongoose");
const moment = require("moment");
const Schema = mongoose.Schema;
//Create comment modle
const CommentSchema = new mongoose.Schema({
    comment: { type: String, max: 500 },
    author: { type: Schema.Types.ObjectId, ref: "User" },
    timeStamp: { type: Date, default: Date.now },
    to: { type: Schema.Types.ObjectId, ref: "Message" }
});
//Virtuals
CommentSchema.virtual("url").get(function (_id) {
    return `${this._id}`;
});
CommentSchema.virtual("date").get(function () {
    return moment(this.timeStamp).fromNow();
});
exports.default = mongoose.model("Comment", CommentSchema);
