import db from "model";

import getSaltedHash from "util/getSaltedHash";

import type { UserRow, PublicUserRow } from "db";

/**
 * @description 조건에 일치하는 모든 사용자 정보를 배열 형태로 가져옵니다.
 */
export default async function getUsers(filter: Partial<UserRow>) {
  const queryResult = await db.query<UserRow[]>("SELECT * FROM user WHERE ?", [filter]);

  let result: PublicUserRow[];

  // 비밀번호가 주어진 경우, 비밀번호가 일치하는 사용자만 반환한다.
  if (filter.password !== undefined) {
    result = queryResult[0].filter((user) => user.password === getSaltedHash(filter.password!, user.salt));
  }
  result = queryResult[0];

  // id와 name만 반환한다.
  return result.map(
    (user) =>
      ({
        id: user.id,
        name: user.name,
      } as PublicUserRow)
  );
}
