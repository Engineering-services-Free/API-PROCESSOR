import { ApplicationError } from "../common/errors/application.error.js";
import { deleteStorageFile } from "../common/storage/storage.js";

import {
  aboutSchema,
  updateAboutSchema,
} from "../common/validators/service.validator.js";

import { AboutDao, aboutDao } from "../daos/about.dao.js";

export class AboutService {
  constructor(private readonly dao: AboutDao = aboutDao) {}

  public async createAbout(data: unknown) {
    const validatedData = aboutSchema.parse(data);

    const existingAbout = await this.dao.findAbout();

    if (existingAbout) {
      throw new ApplicationError(
        "About information already exists",
        409,
        "DUPLICATE_RESOURCE",
      );
    }

    return this.dao.createAbout(validatedData);
  }

  public async getAbout() {
    const about = await this.dao.findAbout();

    return about ?? null;
  }

  public async updateAbout(data: unknown) {
    const validatedData = updateAboutSchema.parse(data);

    const existingAbout = await this.dao.findAbout();

    if (!existingAbout) {
      throw new ApplicationError(
        "About information not found",
        404,
        "NOT_FOUND",
      );
    }

    const oldStoragePath = existingAbout.heroImage?.storagePath;
    const newStoragePath = validatedData.heroImage?.storagePath;

    const isNewHeroImage =
      Boolean(oldStoragePath) &&
      Boolean(newStoragePath) &&
      oldStoragePath !== newStoragePath;

    // 1. Update MongoDB first
    const updatedAbout = await this.dao.updateAbout(validatedData);

    if (!updatedAbout) {
      throw new ApplicationError(
        "Failed to update About information",
        500,
        "INTERNAL_SERVER_ERROR",
      );
    }

    // 2. Delete old image only after DB update succeeds
    if (isNewHeroImage && oldStoragePath) {
      try {
        await deleteStorageFile(oldStoragePath);
      } catch (error) {
        console.error(
          "Failed to delete old About hero image:",
          oldStoragePath,
          error,
        );
      }
    }

    return updatedAbout;
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

    const deletedAbout = await this.dao.deleteAbout();

    if (existingAbout.heroImage?.storagePath) {
      await deleteStorageFile(existingAbout.heroImage.storagePath);
    }

    return deletedAbout;
  }
}

export const aboutService = new AboutService();
