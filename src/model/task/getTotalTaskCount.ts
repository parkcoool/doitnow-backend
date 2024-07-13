import db from "model";

import type { CountRow } from "db";
import type { RowDataPacket } from "mysql2";

export interface GetTotalTaskCountProps {
  userId: number;
}

export default async function getTotalTaskCount({
  userId,
}: GetTotalTaskCountProps) {
  const queryResult = await db.query<(CountRow & RowDataPacket)[]>(
    `SELECT
          COUNT(*) AS count
      FROM
          task
      WHERE 
          ?`,
    [{ userId }]
  );

  return queryResult;
}
