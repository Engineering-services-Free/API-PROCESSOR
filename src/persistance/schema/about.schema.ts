import { Schema } from "mongoose";

import type { About, AboutImage } from "../typings/about.typings";

const aboutImageSchema = new Schema<AboutImage>(
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

export const aboutSchema = new Schema<About>(
  {
    heroImage: {
      type: aboutImageSchema,
      required: true,
    },

    overview: {
      type: String,
      required: true,
    },

    aboutUs: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  },
);
