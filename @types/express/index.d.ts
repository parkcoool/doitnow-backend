export {};

declare global {
  namespace Express {
    interface Request {
      userId?: number;
      email?: string;
    }
  }
}
