import db from "model";

import type { ResultSetHeader } from "mysql2";

interface DeleteNotificationByIdProps {
  id: number[];
  userId: number;
}

export default async function deleteNotificationById({ id, userId }: DeleteNotificationByIdProps) {
  const queryResult = await db.query<ResultSetHeader>(
    `DELETE FROM
      notification
    WHERE
      id IN (?)
      AND userId = ?`,
    [id, userId]
  );

  return queryResult;
}
