import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

import MissingHeaderError from "error/user/MissingHeaderError";
import MissingKeyError from "error/server/MissingKeyError";
import InvalidValueError from "error/user/InvalidValueError";

export default function requireEmailToken(req: Request, res: Response, next: NextFunction) {
  const emailToken = req.headers["authorization"]?.split(" ")[1];
  if (emailToken === undefined) {
    return next(new MissingHeaderError("Authorization"));
  }

  const jwtSecretKey = process.env.JWT_SECRET_KEY;
  if (jwtSecretKey === undefined) {
    return next(new MissingKeyError("JWT_SECRET_KEY"));
  }

  jwt.verify(emailToken, jwtSecretKey, (error, decodedJwt) => {
    if (error || decodedJwt === undefined || typeof decodedJwt === "string") {
      return next(new InvalidValueError("token"));
    }

    req.email = decodedJwt.email;
    return next();
  });
}
