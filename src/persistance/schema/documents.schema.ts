import { Schema } from "mongoose";

import type { Document, DocumentFile } from "../typings/document.typings";
import { isPersistenceFieldRequired } from "../required-fields.js";

const documentFileSchema = new Schema<DocumentFile>(
  {
    url: {
      type: String,
      required: isPersistenceFieldRequired("document", "file.url"),
      trim: true,
    },

    storagePath: {
      type: String,
      required: isPersistenceFieldRequired("document", "file.storagePath"),
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
      required: isPersistenceFieldRequired("document", "title"),
      trim: true,
      maxlength: 200,
    },

    type: {
      type: String,
      required: isPersistenceFieldRequired("document", "type"),
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

    clientId: {
      type: Schema.Types.ObjectId,
      ref: "Client",
      index: true,
    },

    file: {
      type: documentFileSchema,
      required: isPersistenceFieldRequired("document", "file"),
    },

    visibility: {
      type: String,
      enum: ["public", "internal"],
      default: "internal",
      required: isPersistenceFieldRequired("document", "visibility"),
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
  clientId: 1,
  type: 1,
  visibility: 1,
  order: 1,
});
