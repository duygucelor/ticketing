import { CustomError } from "./customError";

export class NotAuthorizedError extends CustomError {
  statusCode = 401;
  constructor() {
    super("NOT_AUTHORIZED");
    Object.setPrototypeOf(this, NotAuthorizedError.prototype);
  }
  serializeErrors() {
    return [{ message: this.message }];
  }
}
