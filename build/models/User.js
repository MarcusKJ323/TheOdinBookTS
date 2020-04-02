"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose = require("mongoose");
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
UserSchema.virtual("url").get(function (_id) {
    return `${this._id}`;
});
UserSchema.virtual("fullname").get(function () {
    return `${this.firstname} ${this.lastname}`;
});
exports.default = mongoose.model("User", UserSchema);
