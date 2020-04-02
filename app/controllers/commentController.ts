import { check, sanitizeBody, validationResult } from "express-validator";
import Comment from "../models/Comment";

export class CommentController {
  //post for the a new message
  public newcom_post = [
    //validates the form
    check("comment", "Must not be empty")
      .not()
      .isEmpty()
      .isLength({ min: 1, max: 500 })
      .trim(),
    //escapes with wildcard
    sanitizeBody("*").escape(),

    (req: any, res: any, next: any) => {
      //sperate Errors from req
      const errors = validationResult(req);
      // creates messge in the db
      const comment = new Comment({
        comment: req.body.comment,
        author: req.user,
        to: req.params.id
      });
      //checks if there are errors
      if (!errors.isEmpty()) {
        // There are errors
        res.render("index", {
          comment: req.body.comment,
          errors: errors.array()
        });
        res.redirect("/");
        return;
      } else {
        //Data is vaild
        comment.save(err => {
          if (err) return next(err);
          res.redirect("/");
        });
      }
    }
  ];
}
