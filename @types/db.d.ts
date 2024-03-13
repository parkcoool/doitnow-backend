declare module "db" {
  interface UserRow {
    id: number;
    email: string;
    salt: string;
    password: string;
    name: string;
    createdAt: string;
  }
}
