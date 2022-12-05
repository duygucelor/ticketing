import { CustomError } from "./customError";

export class DatabaseConnectionError extends CustomError {
  statusCode = 500;
  constructor() {
    super("Error Database Connection");
    Object.setPrototypeOf(this, DatabaseConnectionError.prototype);
  }
  serializeErrors() {
    return [{ message: this.message }];
  }
}
