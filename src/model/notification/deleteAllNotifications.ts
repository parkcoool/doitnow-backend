import db from "model";

import type { ResultSetHeader } from "mysql2";

interface DeleteAllNotificationsProps {
  userId: number;
}

export default async function deleteAllNotifications({ userId }: DeleteAllNotificationsProps) {
  const queryResult = await db.query<ResultSetHeader>("DELETE FROM notification userId = ?", [userId]);

  return queryResult;
}
