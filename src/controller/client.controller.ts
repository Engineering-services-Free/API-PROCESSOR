import type { NextFunction, Request, Response } from "express";
import { clientService } from "../service/index";

interface ClientIdParams {
  id: string;
}

export class ClientController {
  public async createClient(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const client = await clientService.createClient(req.body);

      res.status(201).json({
        success: true,
        data: client,
      });
    } catch (error) {
      next(error);
    }
  }

  public async getClients(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const result = await clientService.getClients(req.query);

      res.status(200).json({
        success: true,
        data: result.items,
        pagination: result.pagination,
      });
    } catch (error) {
      next(error);
    }
  }

  public async getClientById(
    req: Request<ClientIdParams>,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const client = await clientService.getClientById(req.params.id);

      res.status(200).json({
        success: true,
        data: client,
      });
    } catch (error) {
      next(error);
    }
  }

  public async updateClient(
    req: Request<ClientIdParams>,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const client = await clientService.updateClient(req.params.id, req.body);

      res.status(200).json({
        success: true,
        data: client,
      });
    } catch (error) {
      next(error);
    }
  }

  public async deleteClient(
    req: Request<ClientIdParams>,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const client = await clientService.deleteClient(req.params.id);

      res.status(200).json({
        success: true,
        data: client,
      });
    } catch (error) {
      next(error);
    }
  }
}

export const clientController = new ClientController();
