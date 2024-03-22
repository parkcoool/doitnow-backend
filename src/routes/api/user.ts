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

const userRouter = express.Router();

// 컨트롤러
userRouter.post("", [requireEmailToken, validateRequest({ body: SignupBody }), signup]);
userRouter.get("", validateRequest({ query: GetPublicProfileQuery }), getPublicProfile);
userRouter.patch("/", [validateRequest({ body: UpdatePublicProfileBody }), requireUserToken, updatePublicProfile]);
userRouter.get("/private", requireUserToken, getPrivateProfile);
userRouter.patch("/private", [
  validateRequest({ body: UpdatePrivateProfileBody }),
  requireEmailToken,
  updatePrivateProfile,
]);

// 404 핸들 미들웨어
userRouter.use(apiNotFoundErrorHandler);

export default userRouter;
