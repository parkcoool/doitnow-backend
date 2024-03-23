import db from "model";

import type { RowDataPacket } from "mysql2";
import type { UserRow } from "db";

interface FriendRow extends UserRow {
  hasMore: boolean;
}

export interface GetFriendsProps {
  userId: number;
  offset?: number;
}

export default async function getFriends({ userId, offset }: GetFriendsProps) {
  const queryResult = await db.query<(FriendRow & RowDataPacket)[]>(
    `SELECT
      u.*,
      IF(COUNT(*) OVER () > 10, 1, 0) AS hasMore
    FROM
      \`user\` u
      INNER JOIN \`friend\` f ON (
        u.id = f.to
        OR u.id = f.from
      )
    WHERE
      (
        f.from = ?
        OR f.to = ?
      )
      AND u.id != ?
      AND f.status = 'accepted'
    LIMIT 10
    OFFSET ?;`,
    [userId, userId, userId, offset ?? 0]
  );

  queryResult[0] = queryResult[0].map((notification) => ({
    ...notification,
    hasMore: Boolean(notification.hasMore),
  }));

  return queryResult;
}
