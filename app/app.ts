import express, { Router } from "express";
import { Request, Response, NextFunction } from "express";
const router: express.Router = express.Router();
import bodyParser from "body-parser";
import path from "path";
import cookieParser from "cookie-parser";
import logger from "morgan";
import session from "express-session";
import passport from "passport";
import { indexRouter } from "./routes/index";
//const Routes = require("./routes/catalog");
//console.log(indexRouter);
import { Router_Catalog } from "./routes/catalog";
//console.log(Router_Catalog);
//calls mongoDB connection
import "./mongoConfig";
//const app: express.Application = express();

class App {
  public allroutes: Router_Catalog = new Router_Catalog();
  public indexroute: indexRouter = new indexRouter();
  public app: express.Application;
  //public router: express.Router = express.Router();
  constructor() {
    this.app = express();
    this.config();
    //this.allroutes;
    //console.log(this.allroutes);
  }
  private config(): void {
    this.app.set("views", path.join(__dirname, "views"));
    this.app.set("view engine", "pug");
    //calls the passport loing
    require("./config/passport");

    //saves the logged in User inf

    router.use(function(req, res, next) {
      res.locals.currentUser = req.user;
      next();
    });

    this.app.use(
      session({ secret: "cats", resave: false, saveUninitialized: true })
    );
    this.app.use(passport.initialize());
    this.app.use(passport.session());
    this.app.use(bodyParser.urlencoded({ extended: false }));

    this.app.use(logger("dev"));
    this.app.use(express.json());
    this.app.use(cookieParser());
    this.app.use(express.static(path.join(__dirname, "public")));

    //calls the Routes
    this.app.use("/", this.indexroute.indexrouter);
    //console.log(this.indexroute.indexrouter);
    //console.log(this.allroutes.indexcontroller);
    this.app.use("/catalog", this.allroutes.routes);
    // catch 404 and forward to error handler
    this.app.use(
      (err: any, req: Request, res: Response, next: NextFunction) => {
        // set locals, only providing error in development
        res.locals.message = err.message;
        res.locals.error = req.app.get("env") === "development" ? err : {};

        // render the error page
        res.status(err.status || 500);
        res.render("error");
      }
    );
  }
}
export default new App().app;
