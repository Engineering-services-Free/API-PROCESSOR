import { Schema } from "mongoose";

import type { LandingHero, LandingPage } from "../typings/landing-page.typings";

const landingHeroSchema = new Schema<LandingHero>(
  {
    title: {
      type: String,
      required: true,
      trim: true,
      maxlength: 200,
    },

    description: {
      type: String,
      trim: true,
      maxlength: 500,
    },
  },
  {
    _id: false,
  },
);

export const landingPageSchema = new Schema<LandingPage>(
  {
    hero: {
      type: landingHeroSchema,
      required: true,
    },

    whatWeDo: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  },
);
