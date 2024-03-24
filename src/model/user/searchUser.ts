import db from "model";

import type { UserRow } from "db";
import type { RowDataPacket } from "mysql2";

export interface SearchUserProps {
  query: string;
}

export default async function searchUser({ query }: SearchUserProps) {
  const queryResult = await db.query<(UserRow & RowDataPacket)[]>(
    `SELECT 
      *
    FROM
      user u
    WHERE
      u.name LIKE ?
      OR u.username LIKE ?
    LIMIT
      10`,
    [`%${query}%`, `%${query}%`]
  );

  return queryResult;
}
