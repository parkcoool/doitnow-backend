import db from "model";

import type { ResultSetHeader } from "mysql2";

interface DeleteFriendProps {
  userId1: number;
  userId2: number;
}

export default async function deleteFriend({ userId1, userId2 }: DeleteFriendProps) {
  const queryResult = await db.query<ResultSetHeader>(
    "DELETE FROM friend WHERE (`from` = ? AND `to` = ?) OR (`to` = ? AND `from` = ?) LIMIT 1",
    [userId1, userId2, userId1, userId2]
  );

  return queryResult;
}
