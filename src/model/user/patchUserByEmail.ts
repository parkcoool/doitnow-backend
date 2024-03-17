import db from "model";

import type { UserRow } from "db";
import type { ResultSetHeader } from "mysql2";

interface PatchUserProps {
  email: string;
  patch: Partial<UserRow>;
}

export default async function patchUserByEmail({ email, patch }: PatchUserProps) {
  const queryResult = await db.query<ResultSetHeader>("UPDATE user SET ? WHERE id = ?", [patch, email]);

  return queryResult;
}
