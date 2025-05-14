import { ValidationError } from "express-validator";
import { ErrorMessages } from "../utils/text-message";

class ApiError extends Error {
  status: number;
  message: string;
  errors?: ValidationError[];

  constructor(status: number, message: string, errors: ValidationError[] = []) {
    super();
    this.message = message;
    this.errors = errors;
    this.status = status;
  }

  static UnauthorizedError() {
    return new ApiError(401, ErrorMessages.UNAUTHORIZED_ERROR);
  }

  static BadRequest(message: string, errors: ValidationError[] = []) {
    return new ApiError(400, message, errors);
  }
}

export default ApiError;
