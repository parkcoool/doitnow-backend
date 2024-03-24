import db from "model";

import { FriendStatus } from "constant/friendStatus";

import type { RowDataPacket } from "mysql2";
import type { FriendRow } from "db";

interface FriendRequestRow extends FriendRow {
  hasMore: boolean;
}

export interface GetFriendRequestsProps {
  userId: number;
  offset?: number;
}

export default async function getFriendRequests({ userId, offset }: GetFriendRequestsProps) {
  const queryResult = await db.query<(FriendRequestRow & RowDataPacket)[]>(
    `SELECT 
      f.id,
      f.from,
      f.to,
      f.status,
      f.createdAt,
      f.modifiedAt,
      IF(COUNT(*) OVER () > 10, 1, 0) AS hasMore
    FROM
      friend f
    WHERE
      f.to = ?
      AND f.status = ?
    ORDER BY
      f.createdAt DESC
    LIMIT
      ?, 10`,
    [userId, FriendStatus.PENDING, offset]
  );

  queryResult[0] = queryResult[0].map((friendRequest) => ({
    ...friendRequest,
    hasMore: Boolean(friendRequest.hasMore),
  }));

  return queryResult;
}
