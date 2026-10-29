import { Schema } from "mongoose";

import type { LandingHero, LandingPage } from "../typings/landing-page.typings";
import { isPersistenceFieldRequired } from "../required-fields.js";

const landingHeroSchema = new Schema<LandingHero>(
  {
    title: {
      type: String,
      required: isPersistenceFieldRequired("landingPage", "hero.title"),
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
      required: isPersistenceFieldRequired("landingPage", "hero"),
    },

    whatWeDo: {
      type: String,
      required: isPersistenceFieldRequired("landingPage", "whatWeDo"),
    },
  },
  {
    timestamps: true,
    versionKey: false,
  },
);
