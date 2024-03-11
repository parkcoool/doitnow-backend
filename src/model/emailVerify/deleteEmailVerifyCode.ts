import db from "model";

import getSaltedHash from "util/getSaltedHash";

import type { ResultSetHeader } from "mysql2";

/**
 * @description 이메일, 코드를 받아 데이터베이스에서 삭제합니다.
 */
export default async function deleteEmailVerifyCode(code: string, email: string) {
  const hashedCode = getSaltedHash(code, process.env.APP_SECRET!);

  const queryResult = await db.query<ResultSetHeader>(
    "DELETE FROM email_verify WHERE email = ? AND code = ? AND expiresAt > NOW()",
    [email, hashedCode]
  );

  return queryResult[0];
}
