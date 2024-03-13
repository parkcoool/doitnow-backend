import type { RowDataPacket } from "mysql2";
import type { User } from "user";

declare module "db" {
  interface UserRow extends RowDataPacket {
    id: number;
    email: string;
    salt: string;
    password: string;
    name: string;
    createdAt: string;
  }

  interface PublicUserRow extends RowDataPacket {
    id: number;
    email: string;
    name: string;
  }
}
