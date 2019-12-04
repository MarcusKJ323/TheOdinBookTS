const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const moment = require("moment");

//Create comment modle
const CommentSchema = new Schema({
  comment: { type: String, max: 500 },
  author: { type: Schema.Types.ObjectId, ref: "User" },
  timeStamp: { type: Date, default: Date.now },
  to: { type: Schema.Types.ObjectId, ref: "Message" }
});

//Virtuals
CommentSchema.virtual("url").get(() => {
  return `${this._id}`;
});

CommentSchema.virtual("date").get(() => {
  return moment(this.timeStamp).fromNow();
});

module.exports = mongoose.model("Comment", CommentSchema);
