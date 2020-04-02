"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const router = express_1.default.Router();
const body_parser_1 = __importDefault(require("body-parser"));
const path_1 = __importDefault(require("path"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const morgan_1 = __importDefault(require("morgan"));
const express_session_1 = __importDefault(require("express-session"));
const passport_1 = __importDefault(require("passport"));
const index_1 = require("./routes/index");
//const Routes = require("./routes/catalog");
//console.log(indexRouter);
const catalog_1 = require("./routes/catalog");
//console.log(Router_Catalog);
//calls mongoDB connection
require("./mongoConfig");
//const app: express.Application = express();
class App {
    //public router: express.Router = express.Router();
    constructor() {
        this.allroutes = new catalog_1.Router_Catalog();
        this.indexroute = new index_1.indexRouter();
        this.app = express_1.default();
        this.config();
        //this.allroutes;
        //console.log(this.allroutes);
    }
    config() {
        this.app.set("views", path_1.default.join(__dirname, "views"));
        this.app.set("view engine", "pug");
        //calls the passport loing
        require("./config/passport");
        //saves the logged in User inf
        router.use(function (req, res, next) {
            res.locals.currentUser = req.user;
            next();
        });
        this.app.use(express_session_1.default({ secret: "cats", resave: false, saveUninitialized: true }));
        this.app.use(passport_1.default.initialize());
        this.app.use(passport_1.default.session());
        this.app.use(body_parser_1.default.urlencoded({ extended: false }));
        this.app.use(morgan_1.default("dev"));
        this.app.use(express_1.default.json());
        this.app.use(cookie_parser_1.default());
        this.app.use(express_1.default.static(path_1.default.join(__dirname, "public")));
        //calls the Routes
        this.app.use("/", this.indexroute.indexrouter);
        //console.log(this.indexroute.indexrouter);
        //console.log(this.allroutes.indexcontroller);
        this.app.use("/catalog", this.allroutes.routes);
        // catch 404 and forward to error handler
        this.app.use((err, req, res, next) => {
            // set locals, only providing error in development
            res.locals.message = err.message;
            res.locals.error = req.app.get("env") === "development" ? err : {};
            // render the error page
            res.status(err.status || 500);
            res.render("error");
        });
    }
}
exports.default = new App().app;
