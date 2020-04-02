"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose = require("mongoose");
const Schema = mongoose.Schema;
//Create teh Likes model
const LikeSchema = new Schema({
    author: { type: Schema.Types.ObjectId, ref: "User" },
    post: { type: Schema.Types.ObjectId, ref: "Comment" },
    likes: { type: Number, default: 0 }
});
//virtuals
LikeSchema.virtual("url").get(function (_id) {
    return `${this._id}`;
});
exports.default = mongoose.model("Like", LikeSchema);
