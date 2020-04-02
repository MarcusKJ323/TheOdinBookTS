"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const DB = process.env.DB_ADR;
//connetcion with the monogdb
mongoose_1.default.connect(DB, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: true
});
const db = mongoose_1.default.connection;
db.on("error", console.error.bind(console, "mongo connection error"));
