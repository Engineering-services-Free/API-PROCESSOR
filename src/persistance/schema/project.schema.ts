import { Schema } from "mongoose";

import type {
  Project,
  ProjectImage,
  ProjectResult,
  ProjectSeo,
} from "../typings/project.typings";
import { isPersistenceFieldRequired } from "../required-fields.js";

const projectImageSchema = new Schema<ProjectImage>(
  {
    url: {
      type: String,
      required: isPersistenceFieldRequired("project", "heroImage.url"),
      trim: true,
    },

    alt: {
      type: String,
      required: isPersistenceFieldRequired("project", "heroImage.alt"),
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

const projectResultSchema = new Schema<ProjectResult>(
  {
    metric: {
      type: String,
      required: isPersistenceFieldRequired("project", "title"),
      trim: true,
      maxlength: 150,
    },

    value: {
      type: String,
      required: isPersistenceFieldRequired("project", "slug"),
      trim: true,
      maxlength: 150,
    },

    description: {
      type: String,
      trim: true,
      maxlength: 500,
    },
  },
  {
    _id: false,
  },
);

const projectSeoSchema = new Schema<ProjectSeo>(
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

export const projectSchema = new Schema<Project>(
  {
    title: {
      type: String,
      required: isPersistenceFieldRequired("project", "title"),
      trim: true,
      maxlength: 200,
    },

    slug: {
      type: String,
      required: isPersistenceFieldRequired("project", "slug"),
      unique: true,
      lowercase: true,
      trim: true,
      maxlength: 220,
      match: /^[a-z0-9]+(?:-[a-z0-9]+)*$/,
    },

    clientId: {
      type: Schema.Types.ObjectId,
      ref: "Client",
      required: isPersistenceFieldRequired("project", "clientId"),
    },

    industry: {
      type: String,
      required: isPersistenceFieldRequired("project", "industry"),
      trim: true,
      maxlength: 150,
      index: true,
    },

    location: {
      type: String,
      trim: true,
      maxlength: 200,
    },

    shortDescription: {
      type: String,
      required: isPersistenceFieldRequired("project", "shortDescription"),
      trim: true,
      maxlength: 500,
    },

    overview: {
      type: String,
      required: isPersistenceFieldRequired("project", "overview"),
      trim: true,
      maxlength: 20000,
    },

    heroImage: {
      type: projectImageSchema,
      required: isPersistenceFieldRequired("project", "heroImage"),
    },

    gallery: {
      type: [projectImageSchema],
      default: [],
      validate: {
        validator: (images: ProjectImage[]) => images.length <= 30,
        message: "Maximum 30 gallery images are allowed",
      },
    },

    challenge: {
      type: String,
      required: isPersistenceFieldRequired("project", "challenge"),
      trim: true,
      maxlength: 20000,
    },

    solution: {
      type: String,
      required: isPersistenceFieldRequired("project", "solution"),
      trim: true,
      maxlength: 20000,
    },

    engineeringScope: {
      type: [String],
      default: [],
      validate: {
        validator: (items: string[]) => items.length <= 30,
        message: "Maximum 30 engineering scope items are allowed",
      },
    },

    technologies: {
      type: [String],
      default: [],
      validate: {
        validator: (items: string[]) => items.length <= 30,
        message: "Maximum 30 technologies are allowed",
      },
    },

    results: {
      type: [projectResultSchema],
      default: [],
    },

    duration: {
      type: String,
      trim: true,
      maxlength: 100,
    },

    year: {
      type: Number,
      required: isPersistenceFieldRequired("project", "year"),
      min: 1900,
      max: 2100,
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

    relatedServices: {
      type: [Schema.Types.ObjectId],
      ref: "Service",
      default: [],
    },

    seo: {
      type: projectSeoSchema,
      default: undefined,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  },
);

projectSchema.index({
  status: 1,
  order: 1,
});

projectSchema.index({
  status: 1,
  featured: 1,
  order: 1,
});

projectSchema.index({
  industry: 1,
  status: 1,
  year: -1,
});

projectSchema.index({
  createdAt: -1,
  _id: -1,
});

projectSchema.index({
  status: 1,
  createdAt: -1,
  _id: -1,
});