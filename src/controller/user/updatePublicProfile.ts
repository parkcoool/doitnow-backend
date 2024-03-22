import { QueryError } from "mysql2";
import { ER_DUP_ENTRY } from "mysql-error-keys";
import { z } from "zod";

import patchUserById from "model/user/patchUserById";

import ServerError from "error/ServerError";
import DuplicationError from "error/user/DuplicationError";
import NotFoundError from "error/user/NotFoundError";

import userSchema from "schema/user";

import type { RequestHandler } from "express";
import type { APIResponse } from "api";

export const UpdatePublicProfileBody = z
  .object({
    username: userSchema.username,
    name: userSchema.name,
    bio: userSchema.bio,
    profileImage: userSchema.profileImage,
  })
  .partial();

interface ResBody extends APIResponse {}

const updatePublicProfile: RequestHandler<{}, ResBody, z.infer<typeof UpdatePublicProfileBody>> = async function (
  req,
  res,
  next
) {
  const userId = req.userId;
  if (userId === undefined) {
    return next(new ServerError("사용자의 id를 불러올 수 없어요."));
  }

  const { username, name, bio, profileImage } = req.body;

  try {
    const queryResult = await patchUserById({ id: userId, patch: { username, name, bio, profileImage } });
    if (queryResult[0].affectedRows === 0) {
      return next(new NotFoundError("사용자를 찾을 수 없어요."));
    }
  } catch (error) {
    if (error instanceof Error) {
      if ((error as QueryError).code === ER_DUP_ENTRY) {
        return next(new DuplicationError(["이름", "이메일"]));
      }
    }
  }

  return res.status(200).json({
    message: "사용자 정보가 변경됐어요.",
  });
};

export default updatePublicProfile;
