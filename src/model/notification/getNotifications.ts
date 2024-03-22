import db from "model";

import type { RowDataPacket } from "mysql2";
import type { NotificationRow } from "db";

export interface GetNotificationsProps {
  userId: number;
  offsetDate?: string;
}

export default async function getNotifications({ userId, offsetDate }: GetNotificationsProps) {
  if (offsetDate === undefined) {
    const queryResult = await db.query<(NotificationRow & RowDataPacket)[]>(
      "SELECT * FROM notification WHERE ? ORDER BY createdAt DESC LIMIT 10",
      { userId }
    );

    return queryResult;
  } else {
    const queryResult = await db.query<(NotificationRow & RowDataPacket)[]>(
      "SELECT * FROM notification WHERE ? ORDER BY createdAt DESC LIMIT 10 WHERE createdAt < ?",
      [{ userId }, offsetDate]
    );

    return queryResult;
  }
}
