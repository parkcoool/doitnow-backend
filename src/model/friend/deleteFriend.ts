import db from "model";

import type { ResultSetHeader } from "mysql2";

interface DeleteFriendProps {
  from: number;
  to: number;
}

export default async function deleteFriend({ from, to }: DeleteFriendProps) {
  const queryResult = await db.query<ResultSetHeader>("DELETE FROM friend WHERE `from` = ? AND `to` = ?", [from, to]);

  return queryResult;
}
