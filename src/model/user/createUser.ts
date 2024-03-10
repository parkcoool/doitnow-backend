import db from "model";

import getSaltedHash from "util/getSaltedHash";

import type { ResultSetHeader } from "mysql2";
import type { User } from "user";

/**
 * @description 이메일, 평문 비밀번호, 이름을 받아 사용자를 생성하고 `User` 객체를 반환합니다.
 */
export default async function createUser(email: string, password: string, name: string) {
  const salt = Math.random().toString(36).slice(2);
  const hashedPassword = getSaltedHash(password, salt);

  const queryResult = await db.query<ResultSetHeader>("INSERT INTO user SET ?", {
    email,
    password: hashedPassword,
    salt,
    name,
  });

  return { id: queryResult[0].insertId, name: name } as User;
}
