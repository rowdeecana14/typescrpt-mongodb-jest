import { Request, Response, NextFunction } from "express";
import { StatusCodes } from "http-status-codes";
import dotenv from "dotenv";
import TokenHelper from "../helpers/TokenHelper";

export default class AuthMiddleware {
  static handle() {
    return async (req: Request, res: Response, next: NextFunction) => {
      try {
        const token: any = req.headers?.authorization?.split(" ")[1] || req.query?.token || null;
        const auth: any = await TokenHelper.verify(token, "access");

        if (!auth.verified) {
          return res.status(StatusCodes.FORBIDDEN).json({
            message: "Invalid or expired authorization token",
          });
        }

        (req as any).auth = auth.decoded;
        next();
      } catch (error) {
        console.log(error);
      }
    };
  }
}
