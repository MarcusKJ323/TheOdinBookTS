import mongoose = require("mongoose");
const Schema = mongoose.Schema;

//Create Friends model
const FriendsSchema = new Schema({
  requester: { type: Schema.Types.ObjectId, ref: "User" },
  recipient: { type: Schema.Types.ObjectId, ref: "User" },
  status: {
    type: Number,
    enums: [
      0, //add friend
      1, //requested
      2, //pending
      3 //friends
    ]
  }
});

FriendsSchema.virtual("url").get(function(this: any, _id: any) {
  return `${this._id}`;
});

export default mongoose.model("Friend", FriendsSchema);
