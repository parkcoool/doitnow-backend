import db from "model";

import type { ResultSetHeader } from "mysql2";

interface CreateEmailVerifyCodeProps {
  code: string;
  email: string;
  expiresAt: Date;
  ipAddress?: string;
}

export default async function createEmailVerifyCode({ code, email, expiresAt, ipAddress }: CreateEmailVerifyCodeProps) {
  const queryResult = await db.query<ResultSetHeader>(
    "INSERT INTO email_verify_code (code, email, expiresAt, ipAddress) VALUES (?, ?, ?, ?) ON DUPLICATE KEY UPDATE ?",
    [code, email, expiresAt, ipAddress, { code, expiresAt, ipAddress }]
  );

  return queryResult;
}
