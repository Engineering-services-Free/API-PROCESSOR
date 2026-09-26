import { FounderModel } from "../persistance/model/index";
import type {
  CreateFounderInput,
  UpdateFounderInput,
} from "../common/validators/service.validator.js";
import type { Founder } from "../persistance/typings/index.js";

export class FounderDao {
  public async createFounder(data: CreateFounderInput): Promise<Founder> {
    return FounderModel.create(data);
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
    return FounderModel.findByIdAndUpdate(id, data, {
      new: true,
      runValidators: true,
    })
      .lean<Founder>()
      .exec();
  }

  public async deleteFounderById(id: string): Promise<Founder | null> {
    return FounderModel.findByIdAndDelete(id).lean<Founder>().exec();
  }
}

export const founderDao = new FounderDao();
