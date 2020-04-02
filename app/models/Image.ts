import mongoose from "mongoose";
const Schema = mongoose.Schema;

const ImagSchema = new Schema({
  data: { data: Buffer, Contenttype: String },
  author: { type: Schema.Types.ObjectId, ref: "User" },
  timestamp: { type: Date, default: Date.now }
});

ImagSchema.virtual("url").get(function(this: any, _id: any) {
  return `${this._id}`;
});

export default mongoose.model("Image", ImagSchema);
