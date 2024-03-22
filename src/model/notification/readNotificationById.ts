import db from "model";

import type { ResultSetHeader } from "mysql2";

interface ReadNotificationById {
  id: number;
  userId: number;
}

export default async function readNotificationById({ id, userId }: ReadNotificationById) {
  const queryResult = await db.query<ResultSetHeader>(
    "UPDATE notification SET `read` = 1 WHERE id = ? AND userId = ?",
    [id, userId]
  );

  return queryResult;
}
