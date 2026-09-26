import type { NextFunction, Request, Response } from "express";
import { blogService } from "../service/index";

interface BlogIdParams {
  id: string;
}

interface BlogSlugParams {
  slug: string;
}

export class BlogController {
  public async createBlog(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const blog = await blogService.createBlog(req.body);

      res.status(201).json({
        success: true,
        data: blog,
      });
    } catch (error) {
      next(error);
    }
  }

  public async getBlogs(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const result = await blogService.getBlogs(req.query);

      res.status(200).json({
        success: true,
        data: result.items,
        pagination: result.pagination,
      });
    } catch (error) {
      next(error);
    }
  }

  public async getBlogById(
    req: Request<BlogIdParams>,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const blog = await blogService.getBlogById(req.params.id);

      res.status(200).json({
        success: true,
        data: blog,
      });
    } catch (error) {
      next(error);
    }
  }

  public async getBlogBySlug(
    req: Request<BlogSlugParams>,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const blog = await blogService.getBlogBySlug(req.params.slug);

      res.status(200).json({
        success: true,
        data: blog,
      });
    } catch (error) {
      next(error);
    }
  }

  public async updateBlog(
    req: Request<BlogIdParams>,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const blog = await blogService.updateBlog(req.params.id, req.body);

      res.status(200).json({
        success: true,
        data: blog,
      });
    } catch (error) {
      next(error);
    }
  }

  public async deleteBlog(
    req: Request<BlogIdParams>,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const blog = await blogService.deleteBlog(req.params.id);

      res.status(200).json({
        success: true,
        data: blog,
      });
    } catch (error) {
      next(error);
    }
  }
}

export const blogController = new BlogController();
