import { Schema } from "mongoose";

import type { Founder, FounderImage } from "../typings/founder.typings";
import { isPersistenceFieldRequired } from "../required-fields.js";

const founderImageSchema = new Schema<FounderImage>(
  {
    url: {
      type: String,
      required: isPersistenceFieldRequired("founder", "image.url"),
      trim: true,
    },

    alt: {
      type: String,
      required: isPersistenceFieldRequired("founder", "image.alt"),
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

export const founderSchema = new Schema<Founder>(
  {
    name: {
      type: String,
      required: isPersistenceFieldRequired("founder", "name"),
      trim: true,
      maxlength: 150,
    },

    image: {
      type: founderImageSchema,
      required: isPersistenceFieldRequired("founder", "image"),
    },

    overview: {
      type: String,
      required: isPersistenceFieldRequired("founder", "overview"),
      trim: true,
      maxlength: 2000,
    },

    experience: {
      type: String,
      required: isPersistenceFieldRequired("founder", "experience"),
    },
    order: {
      type: Number,
      required: isPersistenceFieldRequired("founder", "order"),
      min: 0,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  },
);

founderSchema.index({ order: 1 }, { unique: true });
