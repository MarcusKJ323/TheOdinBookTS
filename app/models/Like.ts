import mongoose = require("mongoose");
const Schema = mongoose.Schema;

//Create teh Likes model
const LikeSchema = new Schema({
  author: { type: Schema.Types.ObjectId, ref: "User" },
  post: { type: Schema.Types.ObjectId, ref: "Comment" },
  likes: { type: Number, default: 0 }
});

//virtuals
LikeSchema.virtual("url").get(function(this: any, _id: any) {
  return `${this._id}`;
});

export default mongoose.model("Like", LikeSchema);
