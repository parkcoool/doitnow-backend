import { NotificationType } from "constant/notificationType";

declare module "db" {
  interface CountRow {
    count: number;
  }

  interface UserRow {
    id: number;
    email: string;
    username: string;
    name: string;
    password: string;
    salt: string;
    bio: string | null;
    profileImage: string | null;
    createdAt: string;
  }

  interface EmailVerifyCodeRow {
    email: string;
    code: string;
    ipAddress: string;
    expiresAt: string;
    createdAt: string;
  }

  interface NotificationRow {
    id: number;
    userId: number;
    text: string;
    link: string;
    type: NotificationType;
    read: boolean;
    createdAt: string;
  }
}
