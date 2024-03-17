import db from "model";

import type { UserRow } from "db";
import type { FieldPacket, RowDataPacket } from "mysql2";

export interface GetUserByUsernameProps {
  username: string;
  password?: string;
}

export default async function getUserById({ username, password }: GetUserByUsernameProps) {
  let queryResult: [(UserRow & RowDataPacket)[], FieldPacket[]];

  if (password === undefined) {
    queryResult = await db.query<(UserRow & RowDataPacket)[]>("SELECT * FROM user WHERE ?", { username });
  } else {
    queryResult = await db.query<(UserRow & RowDataPacket)[]>("SELECT * FROM user WHERE ? AND ?", [
      { username },
      { password },
    ]);
  }

  return queryResult;
}
