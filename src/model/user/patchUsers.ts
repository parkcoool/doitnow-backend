import db from "model";

import getSaltedHash from "util/getSaltedHash";

import type { ResultSetHeader } from "mysql2";

interface PatchUserProps {
  email: string;
  password: {
    password: string;
    salt: string;
  };
  name: string;
}

export default async function patchUser(id: number, patch: Partial<PatchUserProps>) {
  const clonedPatch = { ...patch, password: undefined as string | undefined };

  // 비밀번호를 변경하는 경우, 비밀번호를 salt와 해싱한다.
  if (patch.password) {
    clonedPatch.password = getSaltedHash(patch.password.password, patch.password.salt);
  }

  const queryResult = await db.query<ResultSetHeader>("UPDATE user SET ? WHERE id = ?", [clonedPatch, id]);
  return queryResult;
}
