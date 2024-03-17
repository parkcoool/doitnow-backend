import db from "model";

import type { ResultSetHeader } from "mysql2";

interface DeleteEmailVerifyCodeProps {
  code: string;
  email: string;
}

export default async function deleteEmailVerifyCode({ code, email }: DeleteEmailVerifyCodeProps) {
  const queryResult = await db.query<ResultSetHeader>(
    "DELETE FROM email_verify WHERE email = ? AND code = ? AND expiresAt > NOW()",
    [email, code]
  );

  return queryResult;
}
