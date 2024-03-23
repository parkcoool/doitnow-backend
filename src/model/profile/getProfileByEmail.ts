import db from "model";

interface Row {
  id: number;
  email: string;
  name: string;
  username: string;
  bio: string | null;
  createdAt: string;
  profileImage: string | null;
  isFriend: boolean;
}

import type { RowDataPacket } from "mysql2";

export interface GetProfileByEmailProps {
  viewerId: number;
  targetEmail: string;
}

export default async function getProfileById({ viewerId, targetEmail }: GetProfileByEmailProps) {
  const queryResult = await db.query<(Row & RowDataPacket)[]>(
    `SELECT
      u.id,
      u.email,
      u.name,
      u.username,
      u.bio,
      u.createdAt,
      u.profileImage,
      CASE
          WHEN f.id IS NOT NULL THEN 1
          ELSE 0
      END AS isFriend
    FROM
      user u
    LEFT JOIN
      friend f ON ((u.id = f.to AND f.from = ?) OR (u.id = f.from AND f.to = ?))
    WHERE
      u.email = ?
    LIMIT
      1`,
    [viewerId, viewerId, targetEmail]
  );

  queryResult[0] = queryResult[0].map((row) => ({ ...row, isFriend: Boolean(row.isFriend) }));

  return queryResult;
}
