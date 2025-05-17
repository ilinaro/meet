import { DtoService } from "../service/dto-service";

declare module "express-serve-static-core" {
  interface Request {
    user?: DtoService;
  }
}
