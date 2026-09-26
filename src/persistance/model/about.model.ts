import { model, type Model } from "mongoose";

import type { About } from "../typings/about.typings";
import { aboutSchema } from "../schema/about.schema";

export const AboutModel: Model<About> = model<About>("About", aboutSchema);
