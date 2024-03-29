import db from "model";

import type { FieldPacket, RowDataPacket } from "mysql2";
import type { NotificationRow as RawNotificationRow } from "db";

interface NotificationRow extends RawNotificationRow {
  hasMore: boolean;
}

export interface GetNotificationsProps {
  userId: number;
  offsetDate?: Date;
}

export default async function getNotifications({ userId, offsetDate }: GetNotificationsProps) {
  let queryResult: [(NotificationRow & RowDataPacket)[], FieldPacket[]];

  if (offsetDate === undefined) {
    queryResult = await db.query<(NotificationRow & RowDataPacket)[]>(
      `SELECT 
        notification.*,
        IF(COUNT(*) OVER () > 10, 1, 0) AS hasMore
      FROM 
          notification
      WHERE
          ?
      ORDER BY
          \`read\`, createdAt DESC
      LIMIT 10`,
      { userId }
    );
  } else {
    queryResult = await db.query<(NotificationRow & RowDataPacket)[]>(
      `SELECT 
        notification.*,
        IF(COUNT(*) OVER () > 10, 1, 0) AS hasMore
      FROM 
          notification
      WHERE 
          ? 
          AND createdAt < STR_TO_DATE(?, '%Y-%m-%d %H:%i:%s.%f') 
      ORDER BY 
          \`read\`, createdAt DESC 
      LIMIT 10`,
      [{ userId }, offsetDate]
    );
  }

  queryResult[0] = queryResult[0].map((notification) => ({
    ...notification,
    read: Boolean(notification.read),
    hasMore: Boolean(notification.hasMore),
  }));

  return queryResult;
}
