const mongoose = require("mongoose");

//connetcion with the monogdb
mongoose.connect(process.env.DB_ADR, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useFindAndModify: true
});
const db = mongoose.connection;
db.on("error", console.error.bind(console, "mongo connection error"));
