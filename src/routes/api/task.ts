import express from "express";

import validateRequest from "middleware/validate/validateRequest";
import requireUserToken from "middleware/token/requireUserToken";
import apiNotFoundErrorHandler from "middleware/error/apiNotFoundErrorHandler";

const taskRouter = express.Router();

// 컨트롤러

// 404 핸들 미들웨어
taskRouter.use(apiNotFoundErrorHandler);

export default taskRouter;
