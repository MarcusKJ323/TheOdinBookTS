const mongoose = require("mongoose");
const Schema = mongoose.Schema;

//Create the Likes model
const LikeSchema = new Schema({
  author: { type: Schema.Types.ObjectId, ref: "User" },
  post: { type: Schema.Types.ObjectId, ref: "Comment" },
  likes: { type: Number }
});

module.exports = mongoose.model("Like", LikeSchema);
