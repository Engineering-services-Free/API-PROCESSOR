import type { NextFunction, Request, Response } from "express";
import { founderService } from "../service/index";

interface FounderIdParams {
  id: string;
}

export class FounderController {
  public async createFounder(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const founder = await founderService.createFounder(req.body);

      res.status(201).json({
        success: true,
        data: founder,
      });
    } catch (error) {
      next(error);
    }
  }

  public async getFounders(
    _req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const founders = await founderService.getFounders();

      res.status(200).json({
        success: true,
        data: founders,
      });
    } catch (error) {
      next(error);
    }
  }

  public async getFounderById(
    req: Request<FounderIdParams>,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const founder = await founderService.getFounderById(req.params.id);

      res.status(200).json({
        success: true,
        data: founder,
      });
    } catch (error) {
      next(error);
    }
  }

  public async updateFounder(
    req: Request<FounderIdParams>,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const founder = await founderService.updateFounder(
        req.params.id,
        req.body,
      );

      res.status(200).json({
        success: true,
        data: founder,
      });
    } catch (error) {
      next(error);
    }
  }

  public async deleteFounder(
    req: Request<FounderIdParams>,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const founder = await founderService.deleteFounder(req.params.id);

      res.status(200).json({
        success: true,
        data: founder,
      });
    } catch (error) {
      next(error);
    }
  }
}

export const founderController = new FounderController();
