import { model, type Model } from "mongoose";

import type { Founder } from "../typings/founder.typings";
import { founderSchema } from "../schema/founder.schema";

export const FounderModel: Model<Founder> = model<Founder>(
  "Founder",
  founderSchema,
);
