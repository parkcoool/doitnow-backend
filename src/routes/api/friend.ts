import express from "express";

import validateRequest from "middleware/validate/validateRequest";
import requireUserToken from "middleware/token/requireUserToken";
import apiNotFoundErrorHandler from "middleware/error/apiNotFoundErrorHandler";

import acceptFriendRequest, { AcceptFriendRequestBody } from "controller/friend/acceptFriendRequest";
import cancelFriendRequest, { CancelFriendRequestBody } from "controller/friend/cancelFriendRequest";
import deleteFriend, { DeleteFriendQuery } from "controller/friend/deleteFriend";
import rejectFriendRequest, { RejectFriendRequestBody } from "controller/friend/rejectFriendRequest";
import requestFriend, { RequestFriendBody } from "controller/friend/requestFriend";
import getFriends, { GetFriendsQuery } from "controller/friend/getFriends";

const friendrouter = express.Router();

// 컨트롤러
friendrouter.post("/accept", [
  requireUserToken,
  validateRequest({ body: AcceptFriendRequestBody }),
  acceptFriendRequest,
]);
friendrouter.post("/cancel", [
  requireUserToken,
  validateRequest({ body: CancelFriendRequestBody }),
  cancelFriendRequest,
]);
friendrouter.delete("/", requireUserToken, validateRequest({ query: DeleteFriendQuery }), deleteFriend);
friendrouter.post("/reject", [
  requireUserToken,
  validateRequest({ body: RejectFriendRequestBody }),
  rejectFriendRequest,
]);
friendrouter.post("/", [requireUserToken, validateRequest({ body: RequestFriendBody }), requestFriend]);
friendrouter.get("/", [requireUserToken, validateRequest({ query: GetFriendsQuery }), getFriends]);

// 404 핸들 미들웨어
friendrouter.use(apiNotFoundErrorHandler);

export default friendrouter;
