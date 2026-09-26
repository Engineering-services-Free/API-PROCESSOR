import type { NextFunction, Request, Response } from "express";
import { projectService } from "../service/index";

interface ProjectIdParams {
  id: string;
}

interface ProjectSlugParams {
  slug: string;
}

export class ProjectController {
  public async createProject(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const project = await projectService.createProject(req.body);

      res.status(201).json({
        success: true,
        data: project,
      });
    } catch (error) {
      next(error);
    }
  }

  public async getProjects(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const result = await projectService.getProjects(req.query);

      res.status(200).json({
        success: true,
        data: result.items,
        pagination: result.pagination,
      });
    } catch (error) {
      next(error);
    }
  }

  public async getProjectById(
    req: Request<ProjectIdParams>,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const project = await projectService.getProjectById(req.params.id);

      res.status(200).json({
        success: true,
        data: project,
      });
    } catch (error) {
      next(error);
    }
  }

  public async getProjectBySlug(
    req: Request<ProjectSlugParams>,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const project = await projectService.getProjectBySlug(req.params.slug);

      res.status(200).json({
        success: true,
        data: project,
      });
    } catch (error) {
      next(error);
    }
  }

  public async updateProject(
    req: Request<ProjectIdParams>,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const project = await projectService.updateProject(
        req.params.id,
        req.body,
      );

      res.status(200).json({
        success: true,
        data: project,
      });
    } catch (error) {
      next(error);
    }
  }

  public async deleteProject(
    req: Request<ProjectIdParams>,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const project = await projectService.deleteProject(req.params.id);

      res.status(200).json({
        success: true,
        data: project,
      });
    } catch (error) {
      next(error);
    }
  }
}

export const projectController = new ProjectController();
