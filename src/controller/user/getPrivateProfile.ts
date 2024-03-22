import getUserById from "model/user/getUserById";

import ServerError from "error/ServerError";
import NotFoundError from "error/user/NotFoundError";

import type { RequestHandler } from "express";
import type { APIResponse } from "api";

interface ResBody extends APIResponse {
  id: number;
  username: string;
  name: string;
  bio: string | null;
  createdAt: string;
  profileImage: string | null;
  email: string;
}

const getPrivateProfile: RequestHandler<{}, ResBody, {}> = async function (req, res, next) {
  const userId = req.userId;
  if (userId === undefined) {
    return next(new ServerError("사용자의 id를 불러올 수 없어요."));
  }

  const queryResult = await getUserById({ id: userId });

  const users = queryResult[0];
  if (users.length === 0) {
    return next(new NotFoundError("사용자를 찾을 수 없어요."));
  }

  const user = users[0];
  return res.status(200).json({
    id: user.id,
    username: user.username,
    name: user.name,
    bio: user.bio,
    createdAt: user.createdAt,
    profileImage: user.profileImage,
    email: user.email,
    message: "사용자 정보를 불러왔어요.",
  });
};

export default getPrivateProfile;
