import express from "express";

import validateRequest from "middleware/validate/validateRequest";
import requireUserToken from "middleware/token/requireUserToken";
import apiNotFoundErrorHandler from "middleware/error/apiNotFoundErrorHandler";

import getNotificationCount from "controller/notification/getNotificationCount";
import getNotifications, { GetNotificationsQuery } from "controller/notification/getNotifications";
import readNotification, { ReadNotificationBody } from "controller/notification/readNotification";
import deleteNotification, { DeleteNotificationBody } from "controller/notification/deleteNotification";

const notificationRouter = express.Router();

// 컨트롤러
notificationRouter.get("/count", requireUserToken, getNotificationCount);
notificationRouter.get("/", [requireUserToken, validateRequest({ query: GetNotificationsQuery }), getNotifications]);
notificationRouter.patch("/", [requireUserToken, validateRequest({ body: ReadNotificationBody }), readNotification]);
notificationRouter.delete("/", [
  requireUserToken,
  validateRequest({ body: DeleteNotificationBody }),
  deleteNotification,
]);

// 404 핸들 미들웨어
notificationRouter.use(apiNotFoundErrorHandler);

export default notificationRouter;
