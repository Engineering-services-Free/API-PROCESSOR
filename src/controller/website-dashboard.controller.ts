import type { NextFunction, Request, Response } from "express";

import { websiteDashboardService } from "../service/website-dashboard.service.js";

export class WebsiteDashboardController {
  public async getServiceBySlug(
    req: Request<{ slug: string }>,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const service = await websiteDashboardService.getServiceBySlug(
        req.params.slug,
      );

      res.status(200).json({ success: true, data: service });
    } catch (error) {
      next(error);
    }
  }

  public async getProjectBySlug(
    req: Request<{ slug: string }>,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const project = await websiteDashboardService.getProjectBySlug(
        req.params.slug,
      );

      res.status(200).json({ success: true, data: project });
    } catch (error) {
      next(error);
    }
  }

  public async getBlogBySlug(
    req: Request<{ slug: string }>,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const blog = await websiteDashboardService.getBlogBySlug(req.params.slug);

      res.status(200).json({ success: true, data: blog });
    } catch (error) {
      next(error);
    }
  }

  public async getPublicDocumentById(
    req: Request<{ id: string }>,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const document = await websiteDashboardService.getPublicDocumentById(
        req.params.id,
      );

      res.status(200).json({ success: true, data: document });
    } catch (error) {
      next(error);
    }
  }

}

export const websiteDashboardController = new WebsiteDashboardController();
