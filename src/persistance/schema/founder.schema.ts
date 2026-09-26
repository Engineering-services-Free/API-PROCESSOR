import { Schema } from "mongoose";

import type { Founder, FounderImage } from "../typings/founder.typings";

const founderImageSchema = new Schema<FounderImage>(
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

export const founderSchema = new Schema<Founder>(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      maxlength: 150,
    },

    image: {
      type: founderImageSchema,
      required: true,
    },

    overview: {
      type: String,
      required: true,
      trim: true,
      maxlength: 2000,
    },

    experience: {
      type: String,
      required: true,
    },
    order: {
      type: Number,
      required: true,
      min: 0,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  },
);

founderSchema.index({ order: 1 }, { unique: true });
