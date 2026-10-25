import { ApplicationError } from "../common/errors/application.error.js";
import {
  WebsiteDashboardDao,
  websiteDashboardDao,
} from "../daos/website-dashboard.dao.js";

export class WebsiteDashboardService {
  constructor(
    private readonly dao: WebsiteDashboardDao = websiteDashboardDao,
  ) {}

  public async getServiceBySlug(slug: string) {
    const service = await this.dao.getPublishedServiceBySlug(slug);

    if (!service) {
      throw new ApplicationError("Service not found", 404, "NOT_FOUND");
    }

    return service;
  }

  public async getProjectBySlug(slug: string) {
    const project = await this.dao.getPublishedProjectBySlug(slug);

    if (!project) {
      throw new ApplicationError("Project not found", 404, "NOT_FOUND");
    }

    return project;
  }

  public async getBlogBySlug(slug: string) {
    const blog = await this.dao.getPublishedBlogBySlug(slug);

    if (!blog) {
      throw new ApplicationError("Blog not found", 404, "NOT_FOUND");
    }

    return blog;
  }

  public async getPublicDocumentById(id: string) {
    const document = await this.dao.getPublicDocumentById(id);

    if (!document) {
      throw new ApplicationError("Document not found", 404, "NOT_FOUND");
    }

    return document;
  }
}

export const websiteDashboardService = new WebsiteDashboardService();
