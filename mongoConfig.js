const mongoose = require("mongoose");

mongoose.connect(process.env.DB_ADR, {
  useNewUrlParser: true,
  useUnifiedTopology: true
});
const db = mongoose.connection;
db.on("error", console.error.bind(console, "mongo connection error"));
