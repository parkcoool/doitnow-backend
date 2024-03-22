import db from "model";

import type { ResultSetHeader } from "mysql2";

interface DeleteFriendRequestProps {
  id: number;
}

export default async function deleteFriendRequest({ id }: DeleteFriendRequestProps) {
  const queryResult = await db.query<ResultSetHeader>("DELETE FROM notification WHERE id = ?", [id]);

  return queryResult;
}
