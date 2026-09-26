import { UpdateQuery } from "mongoose";
import { LandingPage } from "../persistance/typings";
import { LandingPageModel } from "../persistance/model";
import {
  CreateLandingPageInput,
  UpdateLandingPageInput,
} from "../common/validators/service.validator";

export class LandingPageDao {
  public async createLandingPage(
    data: CreateLandingPageInput,
  ): Promise<LandingPage> {
    return LandingPageModel.create(data);
  }
  public async findLandingPage(): Promise<LandingPage | null> {
    return LandingPageModel.findOne().lean<LandingPage>().exec();
  }

  public async updateLandingPage(
    data: UpdateLandingPageInput,
  ): Promise<LandingPage | null> {
    return LandingPageModel.findOneAndUpdate({}, data, {
      new: true,
      runValidators: true,
    })
      .lean<LandingPage>()
      .exec();
  }

  public async deleteLandingPage(): Promise<LandingPage | null> {
    return LandingPageModel.findOneAndDelete({}).lean<LandingPage>().exec();
  }
}

export const landingPageDao = new LandingPageDao();
