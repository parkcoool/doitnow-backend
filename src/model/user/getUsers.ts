import db from "model";

import type { UserRow, PublicUserRow } from "db";

/**
 * @description 조건에 일치하는 모든 사용자 정보를 배열 형태로 가져옵니다.
 */
export default async function getUsers(filter: Partial<UserRow>) {
  const result = await db.query<PublicUserRow[]>("SELECT id, name FROM user WHERE ?", [filter]);
  return result[0];
}
