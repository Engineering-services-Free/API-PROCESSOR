import { Schema } from "mongoose";

import type {
  Contact,
  ContactLocation,
  ContactSocialMedia,
} from "../typings/contact.typings";

const contactSocialMediaSchema = new Schema<ContactSocialMedia>(
  {
    platform: {
      type: String,
      required: true,
      trim: true,
      maxlength: 50,
    },

    url: {
      type: String,
      required: true,
      trim: true,
    },
  },
  {
    _id: false,
  },
);

const contactLocationSchema = new Schema<ContactLocation>(
  {
    mapUrl: {
      type: String,
      required: true,
      trim: true,
    },
  },
  {
    _id: false,
  },
);

export const contactSchema = new Schema<Contact>(
  {
    contactNumber1: {
      type: String,
      required: true,
      trim: true,
      maxlength: 30,
    },

    contactNumber2: {
      type: String,
      trim: true,
      maxlength: 30,
    },

    whatsappNumber: {
      type: String,
      required: true,
      trim: true,
      maxlength: 30,
    },

    email: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
      maxlength: 254,
    },

    socialMedia: {
      type: [contactSocialMediaSchema],
      default: [],
    },

    location: {
      type: contactLocationSchema,
      required: true,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  },
);
