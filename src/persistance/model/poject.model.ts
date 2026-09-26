import { model, type Model } from "mongoose";

import type { Project } from "../typings/project.typings";
import { projectSchema } from "../schema/project.schema";

export const ProjectModel: Model<Project> = model<Project>(
  "Project",
  projectSchema,
);
