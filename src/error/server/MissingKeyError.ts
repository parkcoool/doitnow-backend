import ServerError from "error/ServerError";

export default class MissingKeyError extends ServerError {
  constructor(key: string) {
    super(`Key "${key}" is missing.`);
    this.name = "MissingKeyError";
  }
}
