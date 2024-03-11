import db from "model";

import getSaltedHash from "util/getSaltedHash";

import type { ResultSetHeader } from "mysql2";

/**
 * @description 코드, 이메일, 유효 기간, IP 주소를 받아 테이블에 인증 코드를 upsert합니다.
 */
export default async function addEmailVerifyCode(code: string, email: string, expiresAt: Date, ipAddr?: string) {
  const hashedCode = getSaltedHash(code, process.env.APP_SECRET!);

  const queryResult = await db.query<ResultSetHeader>(
    "INSERT INTO email_verify (code, email, expiresAt, ipAddr) VALUES (?, ?, ?, ?) ON DUPLICATE KEY UPDATE ?",
    [hashedCode, email, expiresAt, ipAddr, { code: hashedCode, expiresAt, ipAddr }]
  );

  return queryResult[0];
}
