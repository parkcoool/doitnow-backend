import UserError from "error/UserError";
import getKoreanPath from "util/getKoreanPath";
import hasJongseong from "util/hasJongseong";

export default class InvalidValueError extends UserError {
  constructor(path: (string | number)[]) {
    const pathString = getKoreanPath(path).join(", ");
    const pathStringAsSubject = `${pathString}${hasJongseong(pathString) ? "이" : "가"}`;
    super(`${pathStringAsSubject} 올바르지 않아요.`, 400);
    this.name = "InvalidValueError";
  }
}
