import db from "model";

import getSaltedHash from "util/getSaltedHash";

import type { ResultSetHeader } from "mysql2";
import type { User } from "user";

interface createUserProps {
  email: string;
  password: string;
  name: string;
}

export default async function createUser({ email, password, name }: createUserProps, salt: string) {
  const hashedPassword = getSaltedHash(password, salt);

  const queryResult = await db.query<ResultSetHeader>("INSERT INTO user SET ?", {
    email,
    password: hashedPassword,
    salt,
    name,
  });

  return queryResult;
}
