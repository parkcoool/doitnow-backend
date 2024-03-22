import db from "model";

import type { ResultSetHeader } from "mysql2";

interface DeleteFriendRequestProps {
  from: number;
  to: number;
}

export default async function deleteFriendRequest({ from, to }: DeleteFriendRequestProps) {
  const queryResult = await db.query<ResultSetHeader>("DELETE FROM friend_request WHERE `from` = ? AND `to` = ?", [
    from,
    to,
  ]);

  return queryResult;
}
