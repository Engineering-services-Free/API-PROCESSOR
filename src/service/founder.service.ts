import { ApplicationError } from "../common/errors/application.error.js";
import {
  founderSchema,
  updateFounderSchema,
} from "../common/validators/service.validator.js";
import { FounderDao, founderDao } from "../daos/founder.dao.js";
import { deleteStorageFile } from "../common/storage/storage.js";

export class FounderService {
  constructor(private readonly dao: FounderDao = founderDao) {}

  public async createFounder(data: unknown) {
    const validatedData = founderSchema.parse(data);

    try {
      return await this.dao.createFounder(validatedData);
    } catch (error: unknown) {
      if (
        typeof error === "object" &&
        error !== null &&
        "code" in error &&
        (error as { code?: number }).code === 11000
      ) {
        throw new ApplicationError(
          "Founder order already exists",
          409,
          "DUPLICATE_RESOURCE",
        );
      }

      throw error;
    }
  }

  public async getFounders() {
    return this.dao.findFounders();
  }

  public async getFounderById(id: string) {
    const founder = await this.dao.findFounderById(id);

    if (!founder) {
      throw new ApplicationError("Founder not found", 404, "NOT_FOUND");
    }

    return founder;
  }

  public async updateFounder(id: string, data: unknown) {
    const validatedData = updateFounderSchema.parse(data);

    const existingFounder = await this.dao.findFounderById(id);

    if (!existingFounder) {
      throw new ApplicationError("Founder not found", 404, "NOT_FOUND");
    }

    const oldStoragePath = existingFounder.image?.storagePath;
    const newStoragePath = validatedData.image?.storagePath;

    const isNewImage =
      Boolean(oldStoragePath) &&
      Boolean(newStoragePath) &&
      oldStoragePath !== newStoragePath;

    // Update MongoDB first
    const updatedFounder = await this.dao.updateFounderById(id, validatedData);

    if (!updatedFounder) {
      throw new ApplicationError(
        "Failed to update Founder",
        500,
        "INTERNAL_SERVER_ERROR",
      );
    }

    // Delete the previous image only after MongoDB succeeds
    if (isNewImage && oldStoragePath) {
      try {
        await deleteStorageFile(oldStoragePath);
      } catch (error) {
        console.error(
          "Failed to delete previous Founder image:",
          oldStoragePath,
          error,
        );
      }
    }

    return updatedFounder;
  }

  public async deleteFounder(id: string) {
    const existingFounder = await this.dao.findFounderById(id);

    if (!existingFounder) {
      throw new ApplicationError("Founder not found", 404, "NOT_FOUND");
    }

    const deletedFounder = await this.dao.deleteFounderById(id);

    if (!deletedFounder) {
      throw new ApplicationError(
        "Failed to delete Founder",
        500,
        "INTERNAL_SERVER_ERROR",
      );
    }

    if (existingFounder.image?.storagePath) {
      try {
        await deleteStorageFile(existingFounder.image.storagePath);
      } catch (error) {
        console.error(
          "Failed to delete Founder image:",
          existingFounder.image.storagePath,
          error,
        );
      }
    }

    return deletedFounder;
  }
}

export const founderService = new FounderService();
