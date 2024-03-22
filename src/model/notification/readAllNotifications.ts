import db from "model";

import type { ResultSetHeader } from "mysql2";

interface ReadAllNotificationsProps {
  userId: number;
}

export default async function readAllNotifications({ userId }: ReadAllNotificationsProps) {
  const queryResult = await db.query<ResultSetHeader>("UPDATE notification SET `read` = 1 WHERE userId = ?", [userId]);

  return queryResult;
}
