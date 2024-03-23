import db from "model";

import type { ProfileRow } from "db";
import type { RowDataPacket } from "mysql2";

export interface GetProfileByEmailProps {
  viewerId: number;
  targetEmail: string;
}

export default async function getProfileById({ viewerId, targetEmail }: GetProfileByEmailProps) {
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
        WHEN f.from = ? THEN 'received'
        ELSE f.status
      END AS friendStatus
    FROM
      user u
    LEFT JOIN
      friend f ON ((u.id = f.to AND f.from = ?) OR (u.id = f.from AND f.to = ?))
    WHERE
      u.email = ?
    LIMIT
      1`,
    [viewerId, viewerId, viewerId, targetEmail]
  );

  return queryResult;
}
