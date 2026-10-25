import {
  BlogModel,
  DocumentModel,
  ProjectModel,
  ServiceModel,
} from "../persistance/model/index.js";
import { Types } from "mongoose";
import type {
  Blog,
  Document,
  Project,
  Service,
} from "../persistance/typings/index.js";

interface PublicImage {
  url: string;
  alt: string;
}

export type PublicServiceDetails = Omit<Service, "seo"> & {
  id: string;
  seo?: Service["seo"];
};

export type PublicProjectDetails = Omit<Project, "seo"> & {
  id: string;
  seo?: Project["seo"];
};

export type PublicBlogDetails = Omit<Blog, "seo"> & {
  id: string;
  seo?: Blog["seo"];
};

export type PublicDocumentDetails = Omit<
  Document,
  "clientId" | "visibility"
> & {
  id: string;
  clientId?: string;
  visibility: "public";
};

export class WebsiteDashboardDao {
  public async getPublishedServiceBySlug(
    slug: string,
  ): Promise<PublicServiceDetails | null> {
    const [service] = await ServiceModel.aggregate<PublicServiceDetails>([
      { $match: { slug, status: "published" } },
      {
        $project: {
          _id: 0,
          id: { $toString: "$_id" },
          title: 1,
          slug: 1,
          tagline: 1,
          shortDescription: 1,
          heroImage: { url: "$heroImage.url", alt: "$heroImage.alt" },
          summary: 1,
          overview: 1,
          detail: 1,
          capabilities: 1,
          technologies: 1,
          industries: 1,
          deliverables: 1,
          process: 1,
          benefits: 1,
          faqs: 1,
          status: 1,
          featured: 1,
          order: 1,
          seo: 1,
          createdAt: 1,
          updatedAt: 1,
        },
      },
      { $limit: 1 },
    ]).exec();

    return service ?? null;
  }

  public async getPublishedProjectBySlug(
    slug: string,
  ): Promise<PublicProjectDetails | null> {
    const [project] = await ProjectModel.aggregate<PublicProjectDetails>([
      { $match: { slug, status: "published" } },
      {
        $project: {
          _id: 0,
          id: { $toString: "$_id" },
          title: 1,
          slug: 1,
          clientId: { $toString: "$clientId" },
          industry: 1,
          location: 1,
          shortDescription: 1,
          overview: 1,
          heroImage: { url: "$heroImage.url", alt: "$heroImage.alt" },
          gallery: {
            $map: {
              input: "$gallery",
              as: "image",
              in: { url: "$$image.url", alt: "$$image.alt" },
            },
          },
          challenge: 1,
          solution: 1,
          engineeringScope: 1,
          technologies: 1,
          results: 1,
          duration: 1,
          year: 1,
          status: 1,
          featured: 1,
          order: 1,
          relatedServices: {
            $map: {
              input: "$relatedServices",
              as: "serviceId",
              in: { $toString: "$$serviceId" },
            },
          },
          seo: 1,
          createdAt: 1,
          updatedAt: 1,
        },
      },
      { $limit: 1 },
    ]).exec();

    return project ?? null;
  }

  public async getPublishedBlogBySlug(
    slug: string,
  ): Promise<PublicBlogDetails | null> {
    const [blog] = await BlogModel.aggregate<PublicBlogDetails>([
      { $match: { slug, status: "published" } },
      {
        $project: {
          _id: 0,
          id: { $toString: "$_id" },
          title: 1,
          slug: 1,
          shortDescription: 1,
          overview: 1,
          coverImage: { url: "$coverImage.url", alt: "$coverImage.alt" },
          content: 1,
          projectId: { $toString: "$projectId" },
          technologies: 1,
          keyTakeaways: 1,
          readingTime: 1,
          status: 1,
          featured: 1,
          order: 1,
          publishedAt: 1,
          seo: 1,
          createdAt: 1,
          updatedAt: 1,
        },
      },
      { $limit: 1 },
    ]).exec();

    return blog ?? null;
  }

  public async getPublicDocumentById(
    id: string,
  ): Promise<PublicDocumentDetails | null> {
    if (!Types.ObjectId.isValid(id)) {
      return null;
    }

    const [document] = await DocumentModel.aggregate<PublicDocumentDetails>([
      { $match: { _id: new Types.ObjectId(id), visibility: "public" } },
      {
        $project: {
          _id: 0,
          id: { $toString: "$_id" },
          title: 1,
          type: 1,
          description: 1,
          clientId: {
            $cond: [
              { $ifNull: ["$clientId", false] },
              { $toString: "$clientId" },
              "$$REMOVE",
            ],
          },
          file: { url: "$file.url", storagePath: "$file.storagePath" },
          visibility: 1,
          order: 1,
          createdAt: 1,
          updatedAt: 1,
        },
      },
      { $limit: 1 },
    ]).exec();

    return document ?? null;
  }

}

export const websiteDashboardDao = new WebsiteDashboardDao();
