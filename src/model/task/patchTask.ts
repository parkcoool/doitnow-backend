import db from "model";

import type { TaskRow } from "db";
import type { ResultSetHeader } from "mysql2";

interface PatchTaskProps {
  userId: number;
  id: number;
  patch: Partial<TaskRow>;
}

export default async function patchTask({ userId, id, patch }: PatchTaskProps) {
  const queryResult = await db.query<ResultSetHeader>(
    "UPDATE task SET ? WHERE creator = ? AND id = ?",
    [patch, userId, id]
  );

  return queryResult;
}
