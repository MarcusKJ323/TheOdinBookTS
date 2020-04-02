"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose = require("mongoose");
const Schema = mongoose.Schema;
//Create Friends model
const FriendsSchema = new Schema({
    requester: { type: Schema.Types.ObjectId, ref: "User" },
    recipient: { type: Schema.Types.ObjectId, ref: "User" },
    status: {
        type: Number,
        enums: [
            0,
            1,
            2,
            3 //friends
        ]
    }
});
FriendsSchema.virtual("url").get(function (_id) {
    return `${this._id}`;
});
exports.default = mongoose.model("Friend", FriendsSchema);
