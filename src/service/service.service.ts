import { ApplicationError } from "../common/errors/application.error.js";
import { deleteStorageFile } from "../common/storage/storage.js";
import {
  serviceSchema,
  updateServiceSchema,
  serviceQuerySchema,
} from "../common/validators/service.validator.js";
import { ServiceDao, serviceDao } from "../daos/services.dao.js";

export class ServiceService {
  constructor(private readonly dao: ServiceDao = serviceDao) {}

  public async createService(data: unknown) {
    const validatedData = serviceSchema.parse(data);

    const existingService = await this.dao.findServiceBySlug(
      validatedData.slug,
    );

    if (existingService) {
      throw new ApplicationError(
        "Service with this slug already exists",
        409,
        "DUPLICATE_RESOURCE",
      );
    }

    return this.dao.createService(validatedData);
  }

  public async getServices(query: unknown) {
    const validatedQuery = serviceQuerySchema.parse(query);

    const filter: {
      status?: "draft" | "published" | "archived";
      featured?: boolean;
    } = {};

    if (validatedQuery.status !== undefined) {
      filter.status = validatedQuery.status;
    }

    if (validatedQuery.featured !== undefined) {
      filter.featured = validatedQuery.featured;
    }

    return this.dao.findServices({
      page: validatedQuery.page,
      limit: validatedQuery.limit,
      filter,
    });
  }

  public async getServiceById(id: string) {
    const service = await this.dao.findServiceById(id);

    if (!service) {
      throw new ApplicationError("Service not found", 404, "NOT_FOUND");
    }

    return service;
  }

  public async getServiceBySlug(slug: string) {
    const service = await this.dao.findServiceBySlug(slug);

    if (!service) {
      throw new ApplicationError("Service not found", 404, "NOT_FOUND");
    }

    return service;
  }

  public async updateService(id: string, data: unknown) {
    const validatedData = updateServiceSchema.parse(data);

    const existingService = await this.dao.findServiceById(id);

    if (!existingService) {
      throw new ApplicationError("Service not found", 404, "NOT_FOUND");
    }

    if (validatedData.slug && validatedData.slug !== existingService.slug) {
      const duplicate = await this.dao.findServiceBySlug(validatedData.slug);

      if (duplicate) {
        throw new ApplicationError(
          "Service with this slug already exists",
          409,
          "DUPLICATE_RESOURCE",
        );
      }
    }

    const oldStoragePath = existingService.heroImage?.storagePath;

    const newStoragePath = validatedData.heroImage?.storagePath;

    const isNewHeroImage =
      Boolean(oldStoragePath) &&
      Boolean(newStoragePath) &&
      oldStoragePath !== newStoragePath;

    const updatedService = await this.dao.updateServiceById(id, validatedData);

    if (!updatedService) {
      throw new ApplicationError(
        "Failed to update service",
        500,
        "INTERNAL_SERVER_ERROR",
      );
    }

    if (isNewHeroImage && oldStoragePath) {
      await deleteStorageFile(oldStoragePath);
    }

    return updatedService;
  }

  public async deleteService(id: string) {
    const existingService = await this.dao.findServiceById(id);

    if (!existingService) {
      throw new ApplicationError("Service not found", 404, "NOT_FOUND");
    }

    const deletedService = await this.dao.deleteServiceById(id);

    /*
     * Delete Firebase image after the
     * MongoDB document has been deleted.
     */
    if (existingService.heroImage.storagePath) {
      await deleteStorageFile(existingService.heroImage.storagePath);
    }

    return deletedService;
  }
}

export const serviceService = new ServiceService();
