import db from "model";

import type { UserRow } from "db";
import type { FieldPacket, RowDataPacket } from "mysql2";

export interface getUserByNameProps {
  name: string;
  password?: string;
}

export default async function getUserByName({ name, password }: getUserByNameProps) {
  let queryResult: [(UserRow & RowDataPacket)[], FieldPacket[]];

  if (password === undefined) {
    queryResult = await db.query<(UserRow & RowDataPacket)[]>("SELECT * FROM user WHERE ?", { name });
  } else {
    queryResult = await db.query<(UserRow & RowDataPacket)[]>("SELECT * FROM user WHERE ? AND ?", [
      { name },
      { password },
    ]);
  }

  return queryResult;
}
