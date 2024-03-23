import db from "model";

import type { ResultSetHeader } from "mysql2";

interface CreateFriendRequestProps {
  from: number;
  to: number;
}

export default async function createFriendRequest({ from, to }: CreateFriendRequestProps) {
  const queryResult = await db.query<ResultSetHeader>("INSERT INTO friend SET ?", {
    from,
    to,
  });

  return queryResult;
}
