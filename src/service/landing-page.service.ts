import { ApplicationError } from "../common/errors/application.error";

import {
  landingPageSchema,
  updateLandingPageSchema,
} from "../common/validators/service.validator";

import { LandingPageDao, landingPageDao } from "../daos/landing-page.dao";

export class LandingPageService {
  constructor(private readonly dao: LandingPageDao = landingPageDao) {}

  public async createLandingPage(data: unknown) {
    // Zod validation
    const validatedData = landingPageSchema.parse(data);

    // Business rule
    const existingLandingPage = await this.dao.findLandingPage();

    if (existingLandingPage) {
      throw new ApplicationError(
        "Landing page already exists",
        409,
        "DUPLICATE_RESOURCE",
      );
    }

    // DAO
    return this.dao.createLandingPage(validatedData);
  }

  public async getLandingPage() {
    const landingPage = await this.dao.findLandingPage();

    return landingPage ?? null;
  }

  public async updateLandingPage(data: unknown) {
    const validatedData = updateLandingPageSchema.parse(data);

    const existingLandingPage = await this.dao.findLandingPage();

    if (!existingLandingPage) {
      throw new ApplicationError("Landing page not found", 404, "NOT_FOUND");
    }

    const updatedLandingPage = await this.dao.updateLandingPage(validatedData);

    if (!updatedLandingPage) {
      throw new ApplicationError(
        "Failed to update landing page",
        500,
        "INTERNAL_SERVER_ERROR",
      );
    }

    return updatedLandingPage;
  }

  public async deleteLandingPage() {
    const existingLandingPage = await this.dao.findLandingPage();

    if (!existingLandingPage) {
      throw new ApplicationError("Landing page not found", 404, "NOT_FOUND");
    }

    return this.dao.deleteLandingPage();
  }
}

export const landingPageService = new LandingPageService();
