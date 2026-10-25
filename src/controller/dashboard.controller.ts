import type { NextFunction, Request, Response } from "express";

import { dashboardService } from "../service/dashboard.service.js";

export class DashboardController {
  public async getDashboard(
    _req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const dashboard = await dashboardService.getDashboard();

      res.status(200).json({
        success: true,
        message: "Dashboard data retrieved successfully",
        data: dashboard,
      });
    } catch (error) {
      next(error);
    }
  }
}

export const dashboardController = new DashboardController();
