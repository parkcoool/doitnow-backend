declare module "db" {
  interface UserRow {
    id: number;
    email: string;
    salt: string;
    password: string;
    name: string;
    bio: string | null;
    createdAt: string;
    profileImage: string | null;
  }
}
