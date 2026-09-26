import type { NextFunction, Request, Response } from "express";
import { contactService } from "../service/index";

export class ContactController {
  public async createContact(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const contact = await contactService.createContact(req.body);

      res.status(201).json({
        success: true,
        data: contact,
      });
    } catch (error) {
      next(error);
    }
  }

  public async getContact(
    _req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const contact = await contactService.getContact();

      res.status(200).json({
        success: true,
        data: contact,
      });
    } catch (error) {
      next(error);
    }
  }

  public async updateContact(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const contact = await contactService.updateContact(req.body);

      res.status(200).json({
        success: true,
        data: contact,
      });
    } catch (error) {
      next(error);
    }
  }

  public async deleteContact(
    _req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const contact = await contactService.deleteContact();

      res.status(200).json({
        success: true,
        data: contact,
      });
    } catch (error) {
      next(error);
    }
  }
}

export const contactController = new ContactController();
