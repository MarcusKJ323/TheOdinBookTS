import { Request, Response } from "express";
import express from "express";
const router = express.Router();

export class indexRouter {
  public indexrouter = router.get("/", (req: Request, res: Response) => {
    res.redirect("/catalog");
  });
}
