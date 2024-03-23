import { FriendStatus } from "constant/friendStatus";
import db from "model";

import type { ResultSetHeader } from "mysql2";

interface AcceptFriendRequestProps {
  from: number;
  to: number;
}

export default async function createFriendRequest({ from, to }: AcceptFriendRequestProps) {
  const queryResult = await db.query<ResultSetHeader>("UPDATE friend SET status = ? WHERE `from` = ? AND `to` = ?", [
    FriendStatus.ACCEPTED,
    from,
    to,
  ]);

  return queryResult;
}
