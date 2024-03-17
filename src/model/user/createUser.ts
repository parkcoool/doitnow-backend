import db from "model";

import type { ResultSetHeader } from "mysql2";

interface CreateUserProps {
  email: string;
  password: string;
  salt: string;
  username: string;
  name: string;
  bio: string | null;
  profileImage: string | null;
}

export default async function createUser({
  email,
  password,
  salt,
  username,
  name,
  bio = null,
  profileImage = null,
}: CreateUserProps) {
  const queryResult = await db.query<ResultSetHeader>("INSERT INTO user SET ?", {
    email,
    password,
    salt,
    username,
    name,
    bio,
    profileImage,
  });

  return queryResult;
}
