import { ApplicationError } from "../common/errors/application.error";

import {
  aboutSchema,
  updateAboutSchema,
} from "../common/validators/service.validator";

import { AboutDao, aboutDao } from "../daos/about.dao";

export class AboutService {
  constructor(private readonly dao: AboutDao = aboutDao) {}

  public async createAbout(data: unknown) {
    // Zod validation
    const validatedData = aboutSchema.parse(data);

    // Business rule
    const existingAbout = await this.dao.findAbout();

    if (existingAbout) {
      throw new ApplicationError(
        "About information already exists",
        409,
        "DUPLICATE_RESOURCE",
      );
    }

    // DAO
    return this.dao.createAbout(validatedData);
  }

  public async getAbout() {
    const about = await this.dao.findAbout();

    if (!about) {
      throw new ApplicationError(
        "About information not found",
        404,
        "NOT_FOUND",
      );
    }

    return about;
  }

  public async updateAbout(data: unknown) {
    // Zod validation
    const validatedData = updateAboutSchema.parse(data);

    const existingAbout = await this.dao.findAbout();

    if (!existingAbout) {
      throw new ApplicationError(
        "About information not found",
        404,
        "NOT_FOUND",
      );
    }

    return this.dao.updateAbout(validatedData);
  }

  public async deleteAbout() {
    const existingAbout = await this.dao.findAbout();

    if (!existingAbout) {
      throw new ApplicationError(
        "About information not found",
        404,
        "NOT_FOUND",
      );
    }

    return this.dao.deleteAbout();
  }
}

export const aboutService = new AboutService();
