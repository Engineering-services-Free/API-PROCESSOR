import type { NextFunction, Request, Response } from "express";
import { landingPageService } from "../service/index";

export class LandingPageController {
  public async createLandingPage(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const landingPage = await landingPageService.createLandingPage(req.body);

      res.status(201).json({
        success: true,
        data: landingPage,
      });
    } catch (error) {
      next(error);
    }
  }

  public async getLandingPage(
    _req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const landingPage = await landingPageService.getLandingPage();

      res.status(200).json({
        success: true,
        data: landingPage,
      });
    } catch (error) {
      next(error);
    }
  }

  public async updateLandingPage(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const landingPage = await landingPageService.updateLandingPage(req.body);

      res.status(200).json({
        success: true,
        data: landingPage,
      });
    } catch (error) {
      next(error);
    }
  }

  public async deleteLandingPage(
    _req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const landingPage = await landingPageService.deleteLandingPage();

      res.status(200).json({
        success: true,
        data: landingPage,
      });
    } catch (error) {
      next(error);
    }
  }
}

export const landingPageController = new LandingPageController();
