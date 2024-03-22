import UserError from "error/UserError";
import getKoreanPath from "util/getKoreanPath";
import hasJongseong from "util/hasJongseong";

export default class DuplicationError extends UserError {
  constructor(path: string[]) {
    let pathString = "";
    if (path.length === 1) pathString = path[0];
    else {
      pathString = getKoreanPath(path.slice(0, -1)).join(", ");
      pathString += ` 또는 ${path.at(-1)}`;
    }

    const pathStringAsSubject = `${pathString}${hasJongseong(pathString) ? "이" : "가"}`;
    super(`${pathStringAsSubject} 이미 사용 중이에요.`, 400);
    this.name = "DuplicationError";
  }
}
