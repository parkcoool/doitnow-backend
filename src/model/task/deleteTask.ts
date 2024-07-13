import db from "model";

import type { ResultSetHeader } from "mysql2";

interface DeleteTaskProps {
  id: number;
}

export default async function deleteTask({ id }: DeleteTaskProps) {
  const queryResult = await db.query<ResultSetHeader>(
    "DELETE FROM task WHERE id = ?",
    [id]
  );

  return queryResult;
}
