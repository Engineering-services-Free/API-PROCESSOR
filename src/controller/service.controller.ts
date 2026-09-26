import type { NextFunction, Request, Response } from "express";
import { serviceService } from "../service/index.js";

interface ServiceIdParams {
  id: string;
}

interface ServiceSlugParams {
  slug: string;
}

export class ServiceController {
  public async createService(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const service = await serviceService.createService(req.body);

      res.status(201).json({
        success: true,
        data: service,
      });
    } catch (error) {
      next(error);
    }
  }

  public async getServices(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const result = await serviceService.getServices(req.query);

      res.status(200).json({
        success: true,
        data: result.items,
        pagination: result.pagination,
      });
    } catch (error) {
      next(error);
    }
  }

  public async getServiceById(
    req: Request<ServiceIdParams>,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const service = await serviceService.getServiceById(req.params.id);

      res.status(200).json({
        success: true,
        data: service,
      });
    } catch (error) {
      next(error);
    }
  }

  public async getServiceBySlug(
    req: Request<ServiceSlugParams>,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const service = await serviceService.getServiceBySlug(req.params.slug);

      res.status(200).json({
        success: true,
        data: service,
      });
    } catch (error) {
      next(error);
    }
  }

  public async updateService(
    req: Request<ServiceIdParams>,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const service = await serviceService.updateService(
        req.params.id,
        req.body,
      );

      res.status(200).json({
        success: true,
        data: service,
      });
    } catch (error) {
      next(error);
    }
  }

  public async deleteService(
    req: Request<ServiceIdParams>,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const service = await serviceService.deleteService(req.params.id);

      res.status(200).json({
        success: true,
        data: service,
      });
    } catch (error) {
      next(error);
    }
  }
}

export const serviceController = new ServiceController();
