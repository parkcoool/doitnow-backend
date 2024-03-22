import { Request, Response, NextFunction } from "express";

import UserError from "error/UserError";

export default function userErrorHandler(error: UserError, req: Request, res: Response, next: NextFunction) {
  if (error instanceof UserError) {
    return res.status(error.statusCode).json({ message: error.message, error: error.name });
  } else {
    return next(error);
  }
}
