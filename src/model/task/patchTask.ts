import db from "model";

import type { TaskRow } from "db";
import type { ResultSetHeader } from "mysql2";

interface PatchTaskProps {
  id: number;
  patch: Partial<TaskRow>;
}

export default async function patchTask({ id, patch }: PatchTaskProps) {
  const queryResult = await db.query<ResultSetHeader>("UPDATE task SET ? WHERE id = ?", [patch, id]);

  return queryResult;
}
