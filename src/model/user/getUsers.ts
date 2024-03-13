import db from "model";

import getSaltedHash from "util/getSaltedHash";

import type { UserRow } from "db";
import type { RowDataPacket } from "mysql2";

interface UserFilter {
  id: number;
  email: string;
  name: string;
  password: string;
}

export default async function getUsers(filter: Partial<UserFilter>) {
  const { password, ...filterWithoutPassword } = filter;

  if (Object.keys(filterWithoutPassword).length > 1) throw new Error("Only one filter is allowed.");

  const queryResult = await db.query<(UserRow & RowDataPacket)[]>(
    "SELECT id, email, name, password, salt FROM user WHERE ?",
    filterWithoutPassword
  );

  // 비밀번호가 주어진 경우, 비밀번호가 일치하는 사용자만 반환한다.
  if (password !== undefined) {
    queryResult[0] = queryResult[0].filter((user) => user.password === getSaltedHash(password, user.salt));
  }

  return queryResult;
}
