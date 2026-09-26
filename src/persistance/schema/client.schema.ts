import { Schema } from "mongoose";

import type { Client, ClientImage } from "../typings/client.typings";

const clientImageSchema = new Schema<ClientImage>(
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

export const clientSchema = new Schema<Client>(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      maxlength: 200,
    },

    image: {
      type: clientImageSchema,
      required: true,
    },

    industry: {
      type: String,
      required: true,
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
