import db from "model";

import type { ResultSetHeader } from "mysql2";

interface DeleteTaskProps {
  userId: number;
  id: number;
}

export default async function deleteTask({ userId, id }: DeleteTaskProps) {
  const queryResult = await db.query<ResultSetHeader>(
    "DELETE FROM task WHERE creator = ? AND id = ?",
    [userId, id]
  );

  return queryResult;
}
