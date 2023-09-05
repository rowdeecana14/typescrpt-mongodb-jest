import { StatusCodes } from "http-status-codes";
import { Request, Response } from "express";

export default class AuthController {
  public static async login(req: Request, res: Response) {
    return res.status(StatusCodes.OK).json({
      message: "Login successfully",
      data: {},
      token: {},
    });
  }

  public static async register(req: Request, res: Response) {
    return res.status(StatusCodes.OK).json({
      message: "Registered successfully",
    });
  }

  public static async logout(req: Request, res: Response) {
    return res.status(StatusCodes.OK).json({
      message: "Logout successfully",
    });
  }
}
