import db from "model";

export interface ProfileRow {
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

export interface GetProfileByNameProps {
  viewerId: number;
  targetName: string;
}

export default async function getProfileByName({ viewerId, targetName }: GetProfileByNameProps) {
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
          WHEN f.id IS NOT NULL THEN 1
          ELSE 0
      END AS isFriend
    FROM
      user u
    LEFT JOIN
      friend f ON ((u.id = f.to AND f.from = ?) OR (u.id = f.from AND f.to = ?))
    WHERE
      u.name = ?
    LIMIT
      1`,
    [viewerId, viewerId, targetName]
  );

  queryResult[0] = queryResult[0].map((row) => ({ ...row, isFriend: Boolean(row.isFriend) }));

  return queryResult;
}
