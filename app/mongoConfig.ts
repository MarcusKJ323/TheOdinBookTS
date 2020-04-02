import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config();
const DB: any = process.env.DB_ADR;

//connetcion with the monogdb
mongoose.connect(DB, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useFindAndModify: true
});
const db = mongoose.connection;
db.on("error", console.error.bind(console, "mongo connection error"));
