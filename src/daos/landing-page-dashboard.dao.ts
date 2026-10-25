import {
  BlogModel,
  ClientModel,
  ProjectModel,
  ServiceModel,
} from "../persistance/model/index.js";

interface PublicImage {
  url: string;
  alt: string;
}

export interface PublicLandingBlog {
  id: string;
  title: string;
  slug: string;
  shortDescription: string;
  coverImage: PublicImage;
  readingTime: number;
  createdAt: Date;
}

export interface PublicLandingProject {
  id: string;
  title: string;
  slug: string;
  shortDescription: string;
  industry: string;
  year: number;
  heroImage: PublicImage;
  createdAt: Date;
}

export interface PublicLandingService {
  id: string;
  title: string;
  slug: string;
  shortDescription: string;
  heroImage: PublicImage;
  featured: boolean;
  createdAt: Date;
}

export interface PublicLandingClient {
  id: string;
  name: string;
  industry: string;
  image: PublicImage;
}

export interface LandingPageDashboardData {
  blogs: PublicLandingBlog[];
  projects: PublicLandingProject[];
  services: PublicLandingService[];
  clients: PublicLandingClient[];
}

export class LandingPageDashboardDao {
  public async getLandingPageDashboard(): Promise<LandingPageDashboardData> {
    const [blogs, projects, services, clients] = await Promise.all([
      BlogModel.aggregate<PublicLandingBlog>([
        { $match: { status: "published" } },
        { $sort: { createdAt: -1, _id: -1 } },
        { $limit: 5 },
        {
          $project: {
            _id: 0,
            id: { $toString: "$_id" },
            title: 1,
            slug: 1,
            shortDescription: 1,
            coverImage: { url: "$coverImage.url", alt: "$coverImage.alt" },
            readingTime: 1,
            createdAt: 1,
          },
        },
      ]).exec(),
      ProjectModel.aggregate<PublicLandingProject>([
        { $match: { status: "published" } },
        { $sort: { createdAt: -1, _id: -1 } },
        { $limit: 5 },
        {
          $project: {
            _id: 0,
            id: { $toString: "$_id" },
            title: 1,
            slug: 1,
            shortDescription: 1,
            industry: 1,
            year: 1,
            heroImage: { url: "$heroImage.url", alt: "$heroImage.alt" },
            createdAt: 1,
          },
        },
      ]).exec(),
      ServiceModel.aggregate<PublicLandingService>([
        { $match: { status: "published" } },
        { $sort: { createdAt: -1, _id: -1 } },
        { $limit: 5 },
        {
          $project: {
            _id: 0,
            id: { $toString: "$_id" },
            title: 1,
            slug: 1,
            shortDescription: 1,
            heroImage: { url: "$heroImage.url", alt: "$heroImage.alt" },
            featured: 1,
            createdAt: 1,
          },
        },
      ]).exec(),
      ClientModel.aggregate<PublicLandingClient>([
        { $sort: { name: 1, createdAt: -1 } },
        {
          $project: {
            _id: 0,
            id: { $toString: "$_id" },
            name: 1,
            industry: 1,
            image: { url: "$image.url", alt: "$image.alt" },
          },
        },
      ]).exec(),
    ]);

    return { blogs, projects, services, clients };
  }
}

export const landingPageDashboardDao = new LandingPageDashboardDao();
