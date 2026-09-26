import { Schema } from "mongoose";

import {
  Service,
  ServiceCapability,
  ServiceFaq,
  ServiceImage,
  ServiceProcessStep,
  ServiceSeo,
} from "../typings";

const serviceImageSchema = new Schema<ServiceImage>(
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

const serviceCapabilitySchema = new Schema<ServiceCapability>(
  {
    title: {
      type: String,
      required: true,
      trim: true,
      maxlength: 150,
    },

    description: {
      type: String,
      required: true,
      trim: true,
      maxlength: 1000,
    },

    icon: {
      type: String,
      trim: true,
      maxlength: 100,
    },
  },
  {
    _id: false,
  },
);

const serviceProcessStepSchema = new Schema<ServiceProcessStep>(
  {
    step: {
      type: Number,
      required: true,
      min: 1,
    },

    title: {
      type: String,
      required: true,
      trim: true,
      maxlength: 150,
    },

    description: {
      type: String,
      required: true,
      trim: true,
      maxlength: 1000,
    },
  },
  {
    _id: false,
  },
);

const serviceFaqSchema = new Schema<ServiceFaq>(
  {
    question: {
      type: String,
      required: true,
      trim: true,
      maxlength: 300,
    },

    answer: {
      type: String,
      required: true,
      trim: true,
      maxlength: 2000,
    },
  },
  {
    _id: false,
  },
);

const serviceSeoSchema = new Schema<ServiceSeo>(
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

export const serviceSchema = new Schema<Service>(
  {
    title: {
      type: String,
      required: true,
      trim: true,
      maxlength: 150,
    },

    slug: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      maxlength: 180,
      match: /^[a-z0-9]+(?:-[a-z0-9]+)*$/,
    },

    tagline: {
      type: String,
      trim: true,
      maxlength: 250,
    },

    shortDescription: {
      type: String,
      required: true,
      trim: true,
      maxlength: 500,
    },

    heroImage: {
      type: serviceImageSchema,
      required: true,
    },

    summary: {
      type: [String],
      default: [],
      validate: {
        validator: (items: string[]) => items.length <= 10,
        message: "Maximum 10 summary points are allowed",
      },
    },

    overview: {
      type: String,
      required: true,
      trim: true,
      maxlength: 5000,
    },

    detail: {
      type: String,
      required: true,
    },

    capabilities: {
      type: [serviceCapabilitySchema],
      default: [],
    },

    technologies: {
      type: [String],
      default: [],
    },

    industries: {
      type: [String],
      default: [],
    },

    deliverables: {
      type: [String],
      default: [],
    },

    process: {
      type: [serviceProcessStepSchema],
      default: [],
    },

    benefits: {
      type: [String],
      default: [],
    },

    faqs: {
      type: [serviceFaqSchema],
      default: [],
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

    seo: {
      type: serviceSeoSchema,
      default: undefined,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  },
);

serviceSchema.index({
  status: 1,
  order: 1,
});

serviceSchema.index({
  status: 1,
  featured: 1,
  order: 1,
});
