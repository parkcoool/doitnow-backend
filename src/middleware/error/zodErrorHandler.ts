import { NextFunction, Request, Response } from "express";
import { ZodError } from "zod";

export default function zodErrorHandler(error: ZodError, req: Request, res: Response, next: NextFunction) {
  if (error instanceof ZodError) {
    return res.status(400).json({ message: error.issues[0].message });
  } else {
    return next(error);
  }
}
