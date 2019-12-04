const mongoose = require("mongoose");
const Schema = mongoose.Schema;

//Create the Likes model
const LikeSchema = new Schema({
  likers: { type: Schema.Types.ObjectId, ref: "User" }
});

module.exports = mongoose.model("Like", LikeSchema);
