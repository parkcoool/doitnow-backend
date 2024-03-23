import db from "model";

import type { FieldPacket, RowDataPacket } from "mysql2";
import type { NotificationRow } from "db";

export interface GetNotificationsProps {
  userId: number;
  offsetDate?: string;
}

export default async function getNotifications({ userId, offsetDate }: GetNotificationsProps) {
  let queryResult: [(NotificationRow & RowDataPacket)[], FieldPacket[]];

  if (offsetDate === undefined) {
    queryResult = await db.query<(NotificationRow & RowDataPacket)[]>(
      "SELECT * FROM notification WHERE ? ORDER BY `read`, createdAt DESC LIMIT 10",
      { userId }
    );
  } else {
    queryResult = await db.query<(NotificationRow & RowDataPacket)[]>(
      "SELECT * FROM notification WHERE ? ORDER BY `read`, createdAt DESC LIMIT 10 WHERE createdAt < ?",
      [{ userId }, offsetDate]
    );
  }

  queryResult[0] = queryResult[0].map((notification) => ({
    ...notification,
    read: Boolean(notification.read),
  }));

  return queryResult;
}
