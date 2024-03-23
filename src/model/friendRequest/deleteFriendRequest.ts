import db from "model";

import type { FieldPacket, ResultSetHeader } from "mysql2";

interface DeleteFriendRequestProps {
  from?: number;
  to?: number;
  id?: number;
}

export default async function deleteFriendRequest({ from, to, id }: DeleteFriendRequestProps) {
  let queryResult: [ResultSetHeader, FieldPacket[]];

  if (from !== undefined && to !== undefined && id !== undefined)
    queryResult = await db.query("DELETE FROM friendRequest WHERE `from` = ? AND `to` = ? AND id = ?", [from, to, id]);
  else if (from !== undefined && to !== undefined)
    queryResult = await db.query("DELETE FROM friendRequest WHERE `from` = ? AND `to` = ?", [from, to]);
  else if (id !== undefined) queryResult = await db.query("DELETE FROM friendRequest WHERE id = ?", [id]);
  else if (from !== undefined) queryResult = await db.query("DELETE FROM friendRequest WHERE `from` = ?", [from]);
  else if (to !== undefined) queryResult = await db.query("DELETE FROM friendRequest WHERE `to` = ?", [to]);
  else throw new Error("At least one of from, to, id should be provided.");

  return queryResult;
}
