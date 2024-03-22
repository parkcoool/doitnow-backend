import UserError from "error/UserError";

export default class InvalidValueError extends UserError {
  constructor(path: (string | number)[], message: string) {
    super(`${message} (${path.join(", ")})`, 400);
    this.name = "InvalidValueError";
  }
}
