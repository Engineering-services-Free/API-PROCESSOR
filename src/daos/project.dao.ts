import { UpdateQuery } from "mongoose";

import {
  PaginatedResult,
  PaginationQuery,
} from "../common/pagination/pagination.types";

import { ProjectModel } from "../persistance/model";
import { Project } from "../persistance/typings";
import {
  CreateProjectInput,
  UpdateProjectInput,
} from "../common/validators/service.validator";

export interface FindProjectsFilter {
  status?: "draft" | "published" | "archived";
  featured?: boolean;
  industry?: string;
}

export interface FindProjectsOptions extends PaginationQuery {
  filter?: FindProjectsFilter;
}

export class ProjectDao {
  public async createProject(data: CreateProjectInput): Promise<Project> {
    return ProjectModel.create(data);
  }

  public async findProjects(
    options: FindProjectsOptions,
  ): Promise<PaginatedResult<Project>> {
    const { page, limit, filter = {} } = options;

    const skip = (page - 1) * limit;

    const [items, total] = await Promise.all([
      ProjectModel.find(filter)
        .sort({
          order: 1,
          year: -1,
          createdAt: -1,
        })
        .skip(skip)
        .limit(limit)
        .lean<Project[]>()
        .exec(),

      ProjectModel.countDocuments(filter).exec(),
    ]);

    const totalPages = Math.ceil(total / limit);

    return {
      items,
      pagination: {
        page,
        limit,
        total,
        totalPages,
        hasNextPage: page < totalPages,
        hasPreviousPage: page > 1,
      },
    };
  }

  public async findProjectById(id: string): Promise<Project | null> {
    return ProjectModel.findById(id).lean<Project>().exec();
  }

  public async findProjectBySlug(slug: string): Promise<Project | null> {
    return ProjectModel.findOne({ slug }).lean<Project>().exec();
  }

  public async updateProjectById(
    id: string,
    data: UpdateProjectInput,
  ): Promise<Project | null> {
    return ProjectModel.findByIdAndUpdate(id, data, {
      new: true,
      runValidators: true,
    })
      .lean<Project>()
      .exec();
  }

  public async deleteProjectById(id: string): Promise<Project | null> {
    return ProjectModel.findByIdAndDelete(id).lean<Project>().exec();
  }
}

export const projectDao = new ProjectDao();
