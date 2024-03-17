import UserError from "error/UserError";

export default class DuplicationError extends UserError {
  constructor(valueName: string) {
    super(`${valueName}이(가) 이미 사용되고 있어요.`, 400);
    this.name = "DuplicationError";
  }
}
