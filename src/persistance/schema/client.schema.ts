import { Schema } from "mongoose";

import type { Client, ClientImage } from "../typings/client.typings";
import { isPersistenceFieldRequired } from "../required-fields.js";

const clientImageSchema = new Schema<ClientImage>(
  {
    url: {
      type: String,
      required: isPersistenceFieldRequired("client", "image.url"),
      trim: true,
    },

    alt: {
      type: String,
      required: isPersistenceFieldRequired("client", "image.alt"),
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

export const clientSchema = new Schema<Client>(
  {
    name: {
      type: String,
      required: isPersistenceFieldRequired("client", "name"),
      trim: true,
      maxlength: 200,
    },

    image: {
      type: clientImageSchema,
      required: isPersistenceFieldRequired("client", "image"),
    },

    industry: {
      type: String,
      required: isPersistenceFieldRequired("client", "industry"),
      trim: true,
      maxlength: 150,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  },
);

clientSchema.index({ industry: 1 });
clientSchema.index({ createdAt: -1, _id: -1 });
clientSchema.index({ name: 1, createdAt: -1 });
