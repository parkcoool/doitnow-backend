import db from "model";

import type { ResultSetHeader } from "mysql2";

interface DeleteEmailVerifyCodeProps {
  code: string;
  email: string;
}

export default async function deleteEmailVerifyCode({ code, email }: DeleteEmailVerifyCodeProps) {
  const queryResult = await db.query<ResultSetHeader>(
    "DELETE FROM email_verify_code WHERE email = ? AND code = ? AND expiresAt > NOW() LIMIT 1",
    [email, code]
  );

  return queryResult;
}
