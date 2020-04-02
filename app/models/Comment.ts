"use strict";
import mongoose = require("mongoose");
import moment = require("moment");
const Schema = mongoose.Schema;

//Create comment modle
const CommentSchema = new mongoose.Schema({
  comment: { type: String, max: 500 },
  author: { type: Schema.Types.ObjectId, ref: "User" },
  timeStamp: { type: Date, default: Date.now },
  to: { type: Schema.Types.ObjectId, ref: "Message" }
});

//Virtuals
CommentSchema.virtual("url").get(function(this: any, _id: any) {
  return `${this._id}`;
});

CommentSchema.virtual("date").get(function(this: any) {
  return moment(this.timeStamp).fromNow();
});

export default mongoose.model("Comment", CommentSchema);
