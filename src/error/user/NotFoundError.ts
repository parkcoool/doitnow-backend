import UserError from "error/UserError";

export default class NotFoundError extends UserError {
  constructor(message: string) {
    super(message, 404);
    this.name = "NotFoundError";
  }
}
