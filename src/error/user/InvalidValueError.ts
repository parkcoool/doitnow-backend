import UserError from "error/UserError";

export default class InvalidValueError extends UserError {
  constructor(valueName: string) {
    super(`${valueName}이(가) 올바르지 않아요.`, 400);
    this.name = "InvalidValueError";
  }
}
