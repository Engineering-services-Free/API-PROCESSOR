import type { NextFunction, Request, Response } from "express";

import { authService } from "../service/index";
import { ApplicationError } from "../common/errors";
import { AuthenticatedRequest } from "../common/middleware/auth.middleware";

export class AuthController {
  public async login(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const result = await authService.login(req.body);

      res.status(200).json({
        success: true,
        data: result,
      });
    } catch (error) {
      next(error);
    }
  }
  public async changePassword(
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      if (!req.user) {
        throw new ApplicationError(
          "Authentication is required",
          401,
          "UNAUTHORIZED",
        );
      }

      await authService.changePassword(req.user.id, req.body);

      res.status(200).json({
        success: true,
        message: "Password changed successfully",
      });
    } catch (error) {
      next(error);
    }
  }
}

export const authController = new AuthController();
