import express from "express";

import validateRequest from "middleware/validate/validateRequest";
import requireUserToken from "middleware/token/requireUserToken";
import apiNotFoundErrorHandler from "middleware/error/apiNotFoundErrorHandler";

import acceptFriendRequest, {
  AcceptFriendRequestBody,
} from "controller/friend/acceptFriendRequest";
import cancelFriendRequest, {
  CancelFriendRequestBody,
} from "controller/friend/cancelFriendRequest";
import deleteFriend, {
  DeleteFriendQuery,
} from "controller/friend/deleteFriend";
import rejectFriendRequest, {
  RejectFriendRequestBody,
} from "controller/friend/rejectFriendRequest";
import requestFriend, {
  RequestFriendBody,
} from "controller/friend/requestFriend";
import getFriends, { GetFriendsQuery } from "controller/friend/getFriends";
import getFriendRequests, {
  GetFriendRequestsQuery,
} from "controller/friend/getFriendRequests";

const friendRouter = express.Router();

// 컨트롤러
friendRouter.post("/accept", [
  requireUserToken,
  validateRequest({ body: AcceptFriendRequestBody }),
  acceptFriendRequest,
]);
friendRouter.post("/cancel", [
  requireUserToken,
  validateRequest({ body: CancelFriendRequestBody }),
  cancelFriendRequest,
]);
friendRouter.delete(
  "/",
  requireUserToken,
  validateRequest({ query: DeleteFriendQuery }),
  deleteFriend
);
friendRouter.post("/reject", [
  requireUserToken,
  validateRequest({ body: RejectFriendRequestBody }),
  rejectFriendRequest,
]);
friendRouter.post("/", [
  requireUserToken,
  validateRequest({ body: RequestFriendBody }),
  requestFriend,
]);
friendRouter.get("/", [
  requireUserToken,
  validateRequest({ query: GetFriendsQuery }),
  getFriends,
]);
friendRouter.get("/request", [
  requireUserToken,
  validateRequest({ query: GetFriendRequestsQuery }),
  getFriendRequests,
]);

// 404 핸들 미들웨어
friendRouter.use(apiNotFoundErrorHandler);

export default friendRouter;
