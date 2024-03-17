import express from "express";

import requireUserToken from "middleware/token/requireUserToken";
import requireEmailToken from "middleware/token/requireEmailToken";
import notFoundHandler from "middleware/common/notFoundHandler";

import updatePublicProfile from "controller/user/updatePublicProfile";
import updatePrivateProfile from "controller/user/updatePrivateProfile";
import getPublicProfile from "controller/user/getPublicProfile";
import getPrivateProfile from "controller/user/getPrivateProfile";
import signup from "controller/user/signup";

const userRouter = express.Router();

// 컨트롤러
userRouter.post("", requireEmailToken, signup);
userRouter.get("", getPublicProfile);
userRouter.patch("/", requireUserToken, updatePublicProfile);
userRouter.get("/private", requireUserToken, getPrivateProfile);
userRouter.patch("/private", requireEmailToken, updatePrivateProfile);

// 404 핸들 미들웨어
userRouter.use(notFoundHandler);

export default userRouter;
