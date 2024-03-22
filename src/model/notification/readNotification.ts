import db from "model";

import type { ResultSetHeader } from "mysql2";

interface ReadNotificationProps {
  id: number;
}

export default async function readNotification({ id }: ReadNotificationProps) {
  const queryResult = await db.query<ResultSetHeader>("UPDATE notification SET `read` = 1 WHERE id = ?", [id]);

  return queryResult;
}
