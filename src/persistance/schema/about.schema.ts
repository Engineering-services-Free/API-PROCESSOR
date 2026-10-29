import { Schema } from "mongoose";

import type { About, AboutImage } from "../typings/about.typings";
import { isPersistenceFieldRequired } from "../required-fields.js";

const aboutImageSchema = new Schema<AboutImage>(
  {
    url: {
      type: String,
      required: isPersistenceFieldRequired("about", "heroImage.url"),
      trim: true,
    },

    alt: {
      type: String,
      required: isPersistenceFieldRequired("about", "heroImage.alt"),
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
      required: isPersistenceFieldRequired("about", "heroImage"),
    },

    overview: {
      type: String,
      required: isPersistenceFieldRequired("about", "overview"),
    },

    aboutUs: {
      type: String,
      required: isPersistenceFieldRequired("about", "aboutUs"),
    },
  },
  {
    timestamps: true,
    versionKey: false,
  },
);
