import type { NextFunction, Request, Response } from "express";
import { aboutService } from "../service/index";

export class AboutController {
  public async createAbout(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const about = await aboutService.createAbout(req.body);

      res.status(201).json({
        success: true,
        data: about,
      });
    } catch (error) {
      next(error);
    }
  }

  public async getAbout(
    _req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const about = await aboutService.getAbout();

      res.status(200).json({
        success: true,
        data: about,
      });
    } catch (error) {
      next(error);
    }
  }

  public async updateAbout(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const about = await aboutService.updateAbout(req.body);

      res.status(200).json({
        success: true,
        data: about,
      });
    } catch (error) {
      next(error);
    }
  }

  public async deleteAbout(
    _req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const about = await aboutService.deleteAbout();

      res.status(200).json({
        success: true,
        data: about,
      });
    } catch (error) {
      next(error);
    }
  }
}

export const aboutController = new AboutController();
