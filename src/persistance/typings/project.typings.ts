import type { Types } from "mongoose";

export type ProjectStatus = "draft" | "published" | "archived";

export interface ProjectImage {
  url: string;
  alt: string;
  storagePath?: string;
}

export interface ProjectResult {
  metric: string;
  value: string;
  description?: string;
}

export interface ProjectSeo {
  metaTitle?: string;
  metaDescription?: string;
  keywords: string[];
}

export interface Project {
  title: string;

  slug: string;

  client?: string;

  industry: string;

  location?: string;

  shortDescription: string;

  overview: string;

  heroImage: ProjectImage;

  gallery: ProjectImage[];

  challenge: string;

  solution: string;

  engineeringScope: string[];

  technologies: string[];

  results: ProjectResult[];

  duration?: string;

  year: number;

  status: ProjectStatus;

  featured: boolean;

  order: number;

  relatedServices: Types.ObjectId[];

  seo?: ProjectSeo;

  createdAt: Date;

  updatedAt: Date;
}
