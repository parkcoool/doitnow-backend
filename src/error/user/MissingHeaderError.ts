import UserError from "error/UserError";

export default class MissingHeaderError extends UserError {
  constructor(key: string) {
    super(`"${key}" 헤더가 누락됐어요.`, 401);
    this.name = "MissingHeaderError";
  }
}
