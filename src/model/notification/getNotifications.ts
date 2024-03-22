import db from "model";

import type { RowDataPacket } from "mysql2";
import type { NotificationRow } from "db";

export interface GetNotificationsProps {
  userId: number;
  offset: number;
}

export default async function getNotifications({ userId, offset }: GetNotificationsProps) {
  const queryResult = await db.query<(NotificationRow & RowDataPacket)[]>(
    "SELECT * FROM notification WHERE ? ORDER BY createdAt DESC LIMIT 10 OFFSET ?",
    [{ userId }, offset]
  );

  return queryResult;
}
