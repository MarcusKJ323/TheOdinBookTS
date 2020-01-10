const mongoose = require("mongoose");
const Schema = mongoose.Schema;

//Create the Friends model
const FriendScheama = new Schema({
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

FriendScheama.virtual("url").get(() => {
  return `${this._id}`;
});
module.exports = mongoose.model("Friend", FriendScheama);
