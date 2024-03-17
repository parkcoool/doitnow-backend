import db from "model";

import type { UserRow } from "db";
import type { FieldPacket, RowDataPacket } from "mysql2";

export interface GetUserByEmailProps {
  email: string;
  password?: string;
}

export default async function getUserByEmail({ email, password }: GetUserByEmailProps) {
  let queryResult: [(UserRow & RowDataPacket)[], FieldPacket[]];

  if (password === undefined) {
    queryResult = await db.query<(UserRow & RowDataPacket)[]>("SELECT * FROM user WHERE ?", { email });
  } else {
    queryResult = await db.query<(UserRow & RowDataPacket)[]>("SELECT * FROM user WHERE ? AND ?", [
      { email },
      { password },
    ]);
  }

  return queryResult;
}
