import db from "model";

import type { RowDataPacket } from "mysql2";
import type { CountRow } from "db";

export interface GetNotificationCountProps {
  userId: number;
}

export default async function getNotificationCount({ userId }: GetNotificationCountProps) {
  const queryResult = await db.query<(CountRow & RowDataPacket)[]>(
    "SELECT COUNT(*) AS count FROM notification WHERE userId = ? AND `read` = 0",
    [userId]
  );

  return queryResult;
}
