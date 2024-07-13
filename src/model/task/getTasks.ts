import db from "model";

import type { FieldPacket, RowDataPacket } from "mysql2";
import type { TaskRow as RawTaskRow } from "db";

type OrderBy = "createdAt" | "due";

interface TaskRow extends RawTaskRow {
  hasMore: boolean;
}

export interface getTasksProps {
  userId: number;
  offset?: number;
  orderBy?: OrderBy;
  onlyUndone?: boolean;
}

export default async function getTasks({
  userId,
  offset,
  orderBy,
  onlyUndone,
}: getTasksProps) {
  let queryResult: [(TaskRow & RowDataPacket)[], FieldPacket[]];

  const filter = {
    userId,
    done: onlyUndone ? 0 : undefined,
  };

  if (offset === undefined) {
    queryResult = await db.query<(TaskRow & RowDataPacket)[]>(
      `SELECT 
        task.*,
        IF(COUNT(*) OVER () > 10, 1, 0) AS hasMore
      FROM 
          task
      WHERE
          ?
      ORDER BY
          ${orderBy ?? "createdAt"} DESC
      LIMIT 10`,
      filter
    );
  } else {
    queryResult = await db.query<(TaskRow & RowDataPacket)[]>(
      `SELECT 
            task.*,
            IF(COUNT(*) OVER () > 10, 1, 0) AS hasMore
        FROM
            task
        WHERE 
            ?
        ORDER BY
            ${orderBy ?? "createdAt"} DESC
        LIMIT 10 OFFSET ?`,
      [filter, offset]
    );
  }

  queryResult[0] = queryResult[0].map((task) => ({
    ...task,
    done: Boolean(task.done),
    hasMore: Boolean(task.hasMore),
  }));

  return queryResult;
}
