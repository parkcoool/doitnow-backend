import db from "model";

import type { ProfileRow } from "db";
import type { RowDataPacket } from "mysql2";

export interface GetUserByIdProps {
  viewerId: number;
  targetId: number;
}

export default async function getProfileById({ viewerId, targetId }: GetUserByIdProps) {
  const queryResult = await db.query<(ProfileRow & RowDataPacket)[]>(
    `SELECT
      u.id,
      u.email,
      u.name,
      u.username,
      u.bio,
      u.createdAt,
      u.profileImage,
      CASE
        WHEN f.status = 'accepted' THEN 'accepted'
        WHEN f.to = ? THEN 'received'
        ELSE f.status
      END AS friendStatus
    FROM
      user u
    LEFT JOIN
      friend f ON ((u.id = f.to AND f.from = ?) OR (u.id = f.from AND f.to = ?))
    WHERE
      u.id = ?
    LIMIT
      1`,
    [viewerId, viewerId, viewerId, targetId]
  );

  return queryResult;
}
