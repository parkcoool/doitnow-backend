import db from "model";

import type { ResultSetHeader } from "mysql2";

interface DeleteNotificationByIdProps {
  id?: number;
  userId: number;
}

export default async function deleteNotificationById({ id, userId }: DeleteNotificationByIdProps) {
  if (id !== undefined) {
    const queryResult = await db.query<ResultSetHeader>("DELETE FROM notification WHERE id = ? AND userId = ?", [
      id,
      userId,
    ]);

    return queryResult;
  } else {
    const queryResult = await db.query<ResultSetHeader>("DELETE FROM notification userId = ?", [userId]);

    return queryResult;
  }
}
