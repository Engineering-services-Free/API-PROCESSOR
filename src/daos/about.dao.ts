import { About } from "../persistance/typings";
import { AboutModel } from "../persistance/model";
import {
  CreateAboutInput,
  UpdateAboutInput,
} from "../common/validators/service.validator";

export class AboutDao {
  public async createAbout(data: CreateAboutInput): Promise<About> {
    return AboutModel.create(data);
  }

  public async findAbout(): Promise<About | null> {
    return AboutModel.findOne().lean<About>().exec();
  }

  public async updateAbout(data: UpdateAboutInput): Promise<About | null> {
    return AboutModel.findOneAndUpdate({}, data, {
      new: true,
      runValidators: true,
    })
      .lean<About>()
      .exec();
  }

  public async deleteAbout(): Promise<About | null> {
    return AboutModel.findOneAndDelete({}).lean<About>().exec();
  }
}

export const aboutDao = new AboutDao();
