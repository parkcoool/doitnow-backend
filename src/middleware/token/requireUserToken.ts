import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

import MissingHeaderError from "error/user/MissingHeaderError";
import MissingKeyError from "error/server/MissingKeyError";
import InvalidValueError from "error/user/InvalidValueError";

export default function requireUserToken(req: Request, res: Response, next: NextFunction) {
  const userToken = req.headers["authorization"]?.split(" ")[1];
  if (userToken === undefined) {
    return next(new MissingHeaderError("Authorization"));
  }

  const jwtSecretKey = process.env.JWT_SECRET_KEY;
  if (jwtSecretKey === undefined) {
    return next(new MissingKeyError("JWT_SECRET_KEY"));
  }

  jwt.verify(userToken, jwtSecretKey, (error, decodedJwt) => {
    if (error || decodedJwt === undefined || typeof decodedJwt === "string") {
      return next(new InvalidValueError(["userToken"]));
    }

    req.userId = decodedJwt.id;
    return next();
  });
}
