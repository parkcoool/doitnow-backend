import express from "express";

import validateRequest from "middleware/validate/validateRequest";
import requireUserToken from "middleware/token/requireUserToken";
import requireEmailToken from "middleware/token/requireEmailToken";
import apiNotFoundErrorHandler from "middleware/error/apiNotFoundErrorHandler";

import getPrivateProfile from "controller/user/getPrivateProfile";
import getPublicProfile, { GetPublicProfileQuery } from "controller/user/getPublicProfile";
import signup, { SignupBody } from "controller/user/signup";
import updatePrivateProfile, { UpdatePrivateProfileBody } from "controller/user/updatePrivateProfile";
import updatePublicProfile, { UpdatePublicProfileBody } from "controller/user/updatePublicProfile";
import getUserIdentifier, { GetUserIdentifierQuery } from "controller/user/getUserIdentifier";
import searchUser, { SearchUserQuery } from "controller/user/searchUser";

const userRouter = express.Router();

// 컨트롤러
userRouter.post("", requireEmailToken, validateRequest({ body: SignupBody }), signup);
userRouter.get("", requireUserToken, validateRequest({ query: GetPublicProfileQuery }), getPublicProfile);
userRouter.patch("/", requireUserToken, validateRequest({ body: UpdatePublicProfileBody }), updatePublicProfile);
userRouter.get("/private", requireUserToken, getPrivateProfile);
userRouter.patch(
  "/private",
  validateRequest({ body: UpdatePrivateProfileBody }),
  requireEmailToken,
  updatePrivateProfile
);
userRouter.get("/identifier", validateRequest({ query: GetUserIdentifierQuery }), getUserIdentifier);
userRouter.get("/search", requireUserToken, validateRequest({ query: SearchUserQuery }), searchUser);

// 404 핸들 미들웨어
userRouter.use(apiNotFoundErrorHandler);

export default userRouter;
