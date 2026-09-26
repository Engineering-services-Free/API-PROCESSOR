import { Schema } from "mongoose";

import type { Blog, BlogImage, BlogSeo } from "../typings/blog.typings";

const blogImageSchema = new Schema<BlogImage>(
  {
    url: {
      type: String,
      required: true,
      trim: true,
    },

    alt: {
      type: String,
      required: true,
      trim: true,
      maxlength: 200,
    },

    storagePath: {
      type: String,
      trim: true,
    },
  },
  {
    _id: false,
  },
);

const blogSeoSchema = new Schema<BlogSeo>(
  {
    metaTitle: {
      type: String,
      trim: true,
      maxlength: 60,
    },

    metaDescription: {
      type: String,
      trim: true,
      maxlength: 160,
    },

    keywords: {
      type: [String],
      default: [],
    },
  },
  {
    _id: false,
  },
);

export const blogSchema = new Schema<Blog>(
  {
    title: {
      type: String,
      required: true,
      trim: true,
      maxlength: 200,
    },

    /**
     * SEO-friendly URL identifier.
     *
     * Example:
     * "solar-monitoring-architecture"
     *
     * Frontend can generate:
     * /blogs/solar-monitoring-architecture
     */
    slug: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      maxlength: 220,
      match: /^[a-z0-9]+(?:-[a-z0-9]+)*$/,
    },

    shortDescription: {
      type: String,
      required: true,
      trim: true,
      maxlength: 500,
    },

    overview: {
      type: String,
      required: true,
      trim: true,
      maxlength: 5000,
    },

    coverImage: {
      type: blogImageSchema,
      required: true,
    },

    /**
     * Sanitized HTML content.
     *
     * Example:
     * <h2>Architecture</h2>
     * <p>...</p>
     */
    content: {
      type: String,
      required: true,
    },

    /**
     * Every blog belongs to a project.
     */
    projectId: {
      type: Schema.Types.ObjectId,
      ref: "Project",
      required: true,
    },

    technologies: {
      type: [String],
      default: [],
      validate: {
        validator: (items: string[]) => items.length <= 30,
        message: "Maximum 30 technologies are allowed",
      },
    },

    keyTakeaways: {
      type: [String],
      default: [],
      validate: {
        validator: (items: string[]) => items.length <= 10,
        message: "Maximum 10 key takeaways are allowed",
      },
    },

    readingTime: {
      type: Number,
      required: true,
      min: 1,
      max: 120,
    },

    status: {
      type: String,
      enum: ["draft", "published", "archived"],
      default: "draft",
    },

    featured: {
      type: Boolean,
      default: false,
    },

    order: {
      type: Number,
      default: 0,
      min: 0,
    },

    publishedAt: {
      type: Date,
    },

    seo: {
      type: blogSeoSchema,
      default: undefined,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  },
);

/**
 * Find published blogs ordered by publication date.
 *
 * Example:
 * GET /api/blogs
 */
blogSchema.index({
  status: 1,
  publishedAt: -1,
});

/**
 * Find blogs belonging to a particular project.
 *
 * Example:
 * GET /api/projects/:projectId/blogs
 */
blogSchema.index({
  projectId: 1,
  status: 1,
  publishedAt: -1,
});

/**
 * Featured published blogs.
 */
blogSchema.index({
  status: 1,
  featured: 1,
  order: 1,
});