import { CustomError } from "./customError";

export class NotFoundError extends CustomError {
  statusCode = 404;
  constructor() {
    super("NOT_FOUND_ERROR");
    Object.setPrototypeOf(this, NotFoundError.prototype);
  }
  serializeErrors() {
    return [{ message: this.message }];
  }
}
