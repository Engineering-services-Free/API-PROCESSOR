import { FounderModel } from "../persistance/model/index";
import type {
  CreateFounderInput,
  UpdateFounderInput,
} from "../common/validators/service.validator.js";
import type { Founder } from "../persistance/typings/index.js";
import {
  createOrderedRecord,
  deleteOrderedRecord,
  moveOrderedRecord,
  updateOrderedRecord,
} from "../common/ordering/order-sequence.service.js";

export class FounderDao {
  public async createFounder(data: CreateFounderInput): Promise<Founder> {
    return createOrderedRecord(
      "founders",
      FounderModel,
      data,
      undefined,
      undefined,
      {},
    );
  }

  public async findFounders(): Promise<Founder[]> {
    return FounderModel.find().sort({ order: 1 }).lean<Founder[]>().exec();
  }

  public async findFounderById(id: string): Promise<Founder | null> {
    return FounderModel.findById(id).lean<Founder>().exec();
  }

  public async updateFounderById(
    id: string,
    data: UpdateFounderInput,
  ): Promise<Founder | null> {
    return updateOrderedRecord(
      "founders",
      FounderModel,
      id,
      data,
      undefined,
      {},
    );
  }

  public async deleteFounderById(id: string): Promise<Founder | null> {
    return deleteOrderedRecord(
      "founders",
      FounderModel,
      id,
      undefined,
      {},
    );
  }

  public async reorderFounderById(
    id: string,
    order: number,
  ): Promise<Founder | null> {
    return moveOrderedRecord(
      "founders",
      FounderModel,
      id,
      order,
      undefined,
      {},
    );
  }
}

export const founderDao = new FounderDao();
