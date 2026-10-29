import { Schema } from "mongoose";

import type {
  Contact,
  ContactLocation,
  ContactSocialMedia,
} from "../typings/contact.typings";
import { isPersistenceFieldRequired } from "../required-fields.js";

const contactSocialMediaSchema = new Schema<ContactSocialMedia>(
  {
    platform: {
      type: String,
      required: isPersistenceFieldRequired("contact", "socialMedia.platform"),
      trim: true,
      maxlength: 50,
    },

    url: {
      type: String,
      required: isPersistenceFieldRequired("contact", "socialMedia.url"),
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
      required: isPersistenceFieldRequired("contact", "location.mapUrl"),
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
      required: isPersistenceFieldRequired("contact", "contactNumber1"),
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
      required: isPersistenceFieldRequired("contact", "whatsappNumber"),
      trim: true,
      maxlength: 30,
    },

    email: {
      type: String,
      required: isPersistenceFieldRequired("contact", "email"),
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
      required: isPersistenceFieldRequired("contact", "location"),
    },
  },
  {
    timestamps: true,
    versionKey: false,
  },
);
