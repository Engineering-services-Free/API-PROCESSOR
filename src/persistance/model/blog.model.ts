import { model, type Model } from "mongoose";

import type { Blog } from "../typings/blog.typings";
import { blogSchema } from "../schema/blog.schema";

export const BlogModel: Model<Blog> = model<Blog>("Blog", blogSchema);
