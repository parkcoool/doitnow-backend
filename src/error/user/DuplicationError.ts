import UserError from "error/UserError";

export default class DuplicationError extends UserError {
  constructor(message: string) {
    super(message, 400);
    this.name = "DuplicationError";
  }
}
