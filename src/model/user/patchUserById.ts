import db from "model";

import type { UserRow } from "db";
import type { ResultSetHeader } from "mysql2";

interface PatchUserProps {
  id: number;
  patch: Partial<UserRow>;
}

export default async function patchUserById({ id, patch }: PatchUserProps) {
  const queryResult = await db.query<ResultSetHeader>("UPDATE user SET ? WHERE id = ?", [patch, id]);

  return queryResult;
}
