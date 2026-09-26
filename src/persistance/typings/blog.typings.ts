import type { Types } from "mongoose";

export type BlogStatus = "draft" | "published" | "archived";

export interface BlogImage {
  url: string;
  alt: string;
  storagePath?: string;
}

export interface BlogSeo {
  metaTitle?: string;
  metaDescription?: string;
  keywords: string[];
}

export interface Blog {
  title: string;

  slug: string;

  shortDescription: string;

  overview: string;

  coverImage: BlogImage;

  /**
   * Sanitized HTML article content.
   */
  content: string;

  /**
   * Project this blog/article belongs to.
   */
  projectId: Types.ObjectId;

  /**
   * Technologies used in the project/article.
   */
  technologies: string[];

  /**
   * Important points highlighted from the article.
   */
  keyTakeaways: string[];

  /**
   * Estimated reading time in minutes.
   */
  readingTime: number;

  status: BlogStatus;

  featured: boolean;

  order: number;

  publishedAt?: Date;

  seo?: BlogSeo;

  createdAt: Date;

  updatedAt: Date;
}
