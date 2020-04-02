import mongoose = require("mongoose");
const Schema = mongoose.Schema;

//Create a user model
const UserSchema = new Schema({
  username: {
    type: String,
    min: 3,
    max: 20
  },
  firstname: {
    type: String,
    min: 2,
    max: 15
  },
  lastname: {
    type: String,
    min: 2,
    max: 15
  },
  password: { type: String, min: 6, required: true },
  messages: [{ type: Schema.Types.ObjectId, ref: "Message" }],
  friend: [{ type: Schema.Types.ObjectId, ref: "Friend" }],
  likes: [{ type: Schema.Types.ObjectId, ref: "Like" }]
});

//Virtuals
UserSchema.virtual("url").get(function(this: any, _id: any) {
  return `${this._id}`;
});

UserSchema.virtual("fullname").get(function(this: any) {
  return `${this.firstname} ${this.lastname}`;
});

export default mongoose.model("User", UserSchema);
