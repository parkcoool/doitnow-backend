import db from "model";

import type { RowDataPacket } from "mysql2";
import type { NotificationRow } from "db";

export interface GetNotificationCountProps {
  userId: number;
}

export default async function getNotificationCount({ userId }: GetNotificationCountProps) {
  const queryResult = await db.query<(NotificationRow & RowDataPacket)[]>("SELECT COUNT(*) FROM notification WHERE ?", {
    userId,
  });

  return queryResult;
}
