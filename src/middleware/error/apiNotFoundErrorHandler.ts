import { Request, Response, NextFunction } from "express";

export default function apiNotFoundErrorHandler(req: Request, res: Response, next: NextFunction) {
  res.status(404).json({ message: "존재하지 않는 API에요." });
}
