import db from "model";

import type { CountRow } from "db";
import type { RowDataPacket } from "mysql2";

export interface GetDoneTaskCountProps {
  userId: number;
}

export default async function getDoneTaskCount({
  userId,
}: GetDoneTaskCountProps) {
  const queryResult = await db.query<(CountRow & RowDataPacket)[]>(
    `SELECT
          COUNT(*) AS count
      FROM
          task
      WHERE
          creator = ? AND
          done = 1 AND
          (startAt IS NULL OR startAt <= NOW()) AND
          (due IS NULL OR NOW() <= due)
          `,
    [userId]
  );

  return queryResult;
}
