import { Schema } from "mongoose";

import type { Document, DocumentFile } from "../typings/document.typings";

const documentFileSchema = new Schema<DocumentFile>(
  {
    url: {
      type: String,
      required: true,
      trim: true,
    },

    storagePath: {
      type: String,
      required: true,
      trim: true,
    },
  },
  {
    _id: false,
  },
);

export const documentSchema = new Schema<Document>(
  {
    title: {
      type: String,
      required: true,
      trim: true,
      maxlength: 200,
    },

    type: {
      type: String,
      required: true,
      enum: [
        "brochure",
        "certificate",
        "company-profile",
        "presentation",
        "other",
      ],
    },

    description: {
      type: String,
      trim: true,
      maxlength: 500,
    },

    file: {
      type: documentFileSchema,
      required: true,
    },

    visibility: {
      type: String,
      enum: ["public", "internal"],
      default: "internal",
      required: true,
    },

    order: {
      type: Number,
      default: 0,
      min: 0,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  },
);

documentSchema.index({
  type: 1,
  visibility: 1,
  order: 1,
});
