const mongoose = require("mongoose");
const Schema = mongoose.Schema;

//Create the Likes model
const LikeSchema = new Schema({
  author: { type: Schema.Types.ObjectId, ref: "User" },
  post: { type: Schema.Types.ObjectId, ref: "Comment" },
  likes: { type: Number, default: 0 }
});

//virtuals
LikeSchema.virtual("url").get(() => {
  return `${this._id}`;
});

module.exports = mongoose.model("Like", LikeSchema);
