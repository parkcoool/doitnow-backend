import { Request, Response, NextFunction } from "express";

const exceptions = ["password"];

export default function trimBodyString(req: Request, res: Response, next: NextFunction) {
  if (req.body) {
    for (const key in req.body) {
      if (exceptions.includes(key)) continue;
      if (typeof req.body[key] === "string") {
        req.body[key] = req.body[key].trim();
      }
    }
  }
  next();
}
