import db from "model";

import getSaltedHash from "util/getSaltedHash";

import type { PublicUserRow, UserRow } from "db";
import type { RowDataPacket } from "mysql2";

interface UserFilter extends RowDataPacket {
  id: number;
  name: string;
  password: string;
  salt: string;
}

/**
 * @description 조건에 일치하는 모든 사용자 정보를 배열 형태로 가져옵니다.
 */
export default async function getUsers(filter: Partial<UserFilter>) {
  const { password, ...filterWithoutPassword } = filter;

  const queryResult = await db.query<UserRow[]>("SELECT id, name, password, salt FROM user WHERE ?", [
    filterWithoutPassword,
  ]);

  let result: PublicUserRow[];

  // 비밀번호가 주어진 경우, 비밀번호가 일치하는 사용자만 반환한다.
  if (password !== undefined) {
    result = queryResult[0].filter((user) => user.password === getSaltedHash(password, user.salt));
  } else {
    result = queryResult[0];
  }

  // id와 name만 반환한다.
  return result.map(
    (user) =>
      ({
        id: user.id,
        name: user.name,
      } as PublicUserRow)
  );
}
