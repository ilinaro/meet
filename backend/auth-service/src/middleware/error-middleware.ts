import { Request, Response, NextFunction } from "express";
import ApiError from "../exceptions/api-error";
import { ErrorMessages } from "../utils/text-message";

function errorMiddleware(
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction,
) {
  if (err instanceof ApiError) {
    res.status(err.status).json({
      message: err.message,
      errors: err.errors,
    });
    return;
  }

  res.status(500).json({ message: ErrorMessages.SERVER_ERROR });
  return;
}

export default errorMiddleware;
