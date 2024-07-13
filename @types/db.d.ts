import { FriendStatus } from "constant/friendStatus";
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

  interface FriendRow {
    id: number;
    from: number;
    to: number;
    status: FriendStatus;
    createdAt: string;
    modifiedAt: string;
  }

  interface ProfileRow {
    id: number;
    email: string;
    name: string;
    username: string;
    bio: string | null;
    createdAt: string;
    profileImage: string | null;
    friendStatus: FriendStatus | null;
  }

  interface TaskRow { 
    id: number;
    creator: number;
    title: string;
    done: boolean;
    due: string | null;
    createdAt: string;
    updatedAt: string;
  }
}
