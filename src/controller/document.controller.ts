import type { NextFunction, Request, Response } from "express";
import { documentService } from "../service/index";

interface DocumentIdParams {
  id: string;
}

export class DocumentController {
  public async createDocument(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const document = await documentService.createDocument(req.body);

      res.status(201).json({
        success: true,
        data: document,
      });
    } catch (error) {
      next(error);
    }
  }

  public async getDocuments(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const result = await documentService.getDocuments(req.query);

      res.status(200).json({
        success: true,
        data: result.items,
        pagination: result.pagination,
      });
    } catch (error) {
      next(error);
    }
  }

  public async getDocumentById(
    req: Request<DocumentIdParams>,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const document = await documentService.getDocumentById(req.params.id);

      res.status(200).json({
        success: true,
        data: document,
      });
    } catch (error) {
      next(error);
    }
  }

  public async updateDocument(
    req: Request<DocumentIdParams>,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const document = await documentService.updateDocument(
        req.params.id,
        req.body,
      );

      res.status(200).json({
        success: true,
        data: document,
      });
    } catch (error) {
      next(error);
    }
  }

  public async deleteDocument(
    req: Request<DocumentIdParams>,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const document = await documentService.deleteDocument(req.params.id);

      res.status(200).json({
        success: true,
        data: document,
      });
    } catch (error) {
      next(error);
    }
  }
}

export const documentController = new DocumentController();
