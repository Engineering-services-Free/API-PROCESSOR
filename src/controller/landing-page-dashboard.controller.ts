import type { NextFunction, Request, Response } from "express";

import { landingPageDashboardService } from "../service/landing-page-dashboard.service.js";

export class LandingPageDashboardController {
  public async getLandingPageDashboard(
    _req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const data =
        await landingPageDashboardService.getLandingPageDashboard();

      res.status(200).json({
        success: true,
        message: "Website landing page data retrieved successfully",
        data,
      });
    } catch (error) {
      next(error);
    }
  }
}

export const landingPageDashboardController =
  new LandingPageDashboardController();
