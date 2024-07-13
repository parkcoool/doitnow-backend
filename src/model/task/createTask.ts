import db from "model";

import type { ResultSetHeader } from "mysql2";

interface CreateTaskProps {
  userId: number;
  title: string;
  due?: string;
}

export default async function createTask({
  userId,
  title,
  due,
}: CreateTaskProps) {
  const queryResult = await db.query<ResultSetHeader>(
    "INSERT INTO task SET ?",
    {
      id: userId,
      title,
      due,
    }
  );

  return queryResult;
}
