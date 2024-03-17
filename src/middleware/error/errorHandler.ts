import { Request, Response, NextFunction } from "express";

export default function errorHandler(error: Error, req: Request, res: Response, next: NextFunction) {
  console.error(error);
  return res.status(500).json({ message: "서버에서 오류가 발생했어요." });
}
