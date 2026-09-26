import { model, type Model } from "mongoose";

import type { LandingPage } from "../typings/landing-page.typings";
import { landingPageSchema } from "../schema/landing.schema";

export const LandingPageModel: Model<LandingPage> = model<LandingPage>(
  "LandingPage",
  landingPageSchema,
);
