import patchUserById from "model/user/patchUserById";

import ServerError from "error/ServerError";
import InvalidValueError from "error/user/InvalidValueError";

import verifyUsername from "util/verify/verifyUsername";
import verifyName from "util/verify/verifyName";
import verifyBio from "util/verify/verifyBio";
import verifyImageUrl from "util/verify/verifyImageUrl";

import type { RequestHandler } from "express";

interface ReqBody {
  username?: string;
  name?: string;
  bio?: string | null;
  profileImage?: string | null;
}

interface ResBody {}

const updatePublicProfile: RequestHandler<{}, ResBody, ReqBody> = async function (req, res, next) {
  const userId = req.userId;
  if (userId === undefined) {
    return next(new ServerError("사용자의 id를 불러올 수 없어요."));
  }

  const { username, name, bio, profileImage } = req.body;

  // 값 검증
  if (username !== undefined && !verifyUsername(username)) return next(new InvalidValueError("username"));
  if (name !== undefined && !verifyName(name)) return next(new InvalidValueError("name"));
  if (bio !== undefined && bio !== null && !verifyBio(bio)) return next(new InvalidValueError("bio"));
  if (profileImage !== undefined && profileImage !== null && !verifyImageUrl(profileImage))
    return next(new InvalidValueError("profileImage"));

  const queryResult = await patchUserById({ id: userId, patch: { username, name, bio, profileImage } });
  if (queryResult[0].affectedRows === 0) {
    return next(new ServerError("사용자를 찾을 수 없어요."));
  }

  return res.status(200).json({});
};

export default updatePublicProfile;
