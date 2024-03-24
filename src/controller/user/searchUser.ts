import { z } from "zod";

import searchUser_ from "model/user/searchUser";

import type { RequestHandler } from "express";
import type { APIResponse } from "api";

export const SearchUserQuery = z.object({
  query: z.string().min(2).max(50),
});

interface ResBody extends APIResponse {
  users: {
    id: number;
    name: string;
    username: string;
    profileImage: string | null;
  }[];
}

const searchUser: RequestHandler<{}, ResBody, {}, z.infer<typeof SearchUserQuery>> = async function (req, res, next) {
  const { query } = req.query;

  const queryResult = await searchUser_({ query });

  const users = queryResult[0].map((user) => ({
    id: user.id,
    name: user.name,
    username: user.username,
    profileImage: user.profileImage,
  }));

  return res.status(200).json({
    users,
    message: "사용자 정보를 불러왔어요.",
  });
};

export default searchUser;
