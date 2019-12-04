const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const moment = require("moment");

// Create the message model
const MessageSchema = new Schema({
  title: { type: String, min: 2, max: 60 },
  timeStamp: { type: Date, default: Date.now },
  content: { type: String, max: 500 },
  author: { type: Schema.Types.ObjectId, ref: "User" },
  likes: { type: Schema.Types.ObjectId, ref: "Like" },
  comment: { type: Schema.Types.ObjectId, ref: "Comment" }
});

// Virtuals
MessageSchema.virtual("url").get(function() {
  return `${this._id}`;
});

MessageSchema.virtual("date").get(function() {
  return moment(this.timeStamp).fromNow();
});

// Model the message and export it
module.exports = mongoose.model("Message", MessageSchema);
