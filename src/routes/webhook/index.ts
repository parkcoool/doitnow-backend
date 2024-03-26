import express from "express";

import githubRouter from "./github";

const webhookRouter = express.Router();

// 라우터
webhookRouter.use("/github", githubRouter);

export default webhookRouter;
