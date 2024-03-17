declare module "db" {
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
}
