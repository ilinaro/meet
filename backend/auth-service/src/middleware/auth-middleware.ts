import { NextFunction, Request, Response } from "express";
import ApiError from "../exceptions/api-error";
import tokenService from "../service/token-service";
import DtoService from "../service/dto-service";

function authMiddleware(req: any, res: Response, next: NextFunction) {
  try {
    const authorizationHeader = req.headers.authorization;
    if (!authorizationHeader) {
      return next(ApiError.UnauthorizedError());
    }

    const accessToken = authorizationHeader.split(" ")[1];
    if (!accessToken) {
      return next(ApiError.UnauthorizedError());
    }

    const userData = tokenService.validateAccessToken(
      accessToken,
    ) as DtoService | null;
    if (!userData) {
      return next(ApiError.UnauthorizedError());
    }

    req.user = userData;
    next();
  } catch (e) {
    return next(ApiError.UnauthorizedError());
  }
}

export default authMiddleware;
