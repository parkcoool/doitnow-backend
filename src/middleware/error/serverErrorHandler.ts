import { Request, Response, NextFunction } from "express";

import ServerError from "error/ServerError";

export default function serverErrorHandler(error: ServerError, req: Request, res: Response, next: NextFunction) {
  if (error instanceof ServerError) {
    console.error(error);
    return res.status(500).json({ message: error.message });
  } else {
    return next(error);
  }
}
