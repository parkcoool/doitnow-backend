import db from "model";

import { NotificationType } from "constant/notificationType";

import type { ResultSetHeader } from "mysql2";

interface CreateNotificationProps {
  userId: number;
  text: string;
  link?: string;
  type: NotificationType;
}

export default async function createNotification({ userId, text, link, type }: CreateNotificationProps) {
  const queryResult = await db.query<ResultSetHeader>("INSERT INTO notification SET ?", {
    userId,
    text,
    link,
    type,
  });

  return queryResult;
}
