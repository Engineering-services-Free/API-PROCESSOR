import { ApplicationError } from "../common/errors/application.error.js";
import { deleteStorageFiles } from "../common/storage/storage.js";
import {
  projectSchema,
  updateProjectSchema,
  projectQuerySchema,
} from "../common/validators/service.validator.js";
import { ProjectDao, projectDao } from "../daos/project.dao.js";

export class ProjectService {
  constructor(private readonly dao: ProjectDao = projectDao) {}

  /*
   * Best-effort Firebase cleanup.
   *
   * The database is already updated when this runs, so a failed
   * storage delete is logged instead of turning a successful
   * save into a 500 error.
   */
  private async cleanupStorage(paths: string[]): Promise<void> {
    if (paths.length === 0) {
      return;
    }

    try {
      await deleteStorageFiles(paths);
    } catch (error) {
      console.error("Failed to delete some project images:", paths, error);
    }
  }

  public async createProject(data: unknown) {
    const validatedData = projectSchema.parse(data);

    const existingProject = await this.dao.findProjectBySlug(
      validatedData.slug,
    );

    if (existingProject) {
      throw new ApplicationError(
        "Project with this slug already exists",
        409,
        "DUPLICATE_RESOURCE",
      );
    }

    return this.dao.createProject(validatedData);
  }

  public async getProjects(query: unknown) {
    const validatedQuery = projectQuerySchema.parse(query);

    /*
     * Only add keys that are defined. Passing `{ industry: undefined }`
     * makes Mongo match documents where the field is null/missing.
     */
    const filter: {
      status?: "draft" | "published" | "archived";
      featured?: boolean;
      industry?: string;
    } = {};

    if (validatedQuery.status !== undefined) {
      filter.status = validatedQuery.status;
    }

    if (validatedQuery.featured !== undefined) {
      filter.featured = validatedQuery.featured;
    }

    if (validatedQuery.industry !== undefined) {
      filter.industry = validatedQuery.industry;
    }

    return this.dao.findProjects({
      page: validatedQuery.page,
      limit: validatedQuery.limit,
      filter,
    });
  }

  public async getProjectById(id: string) {
    const project = await this.dao.findProjectById(id);

    if (!project) {
      throw new ApplicationError("Project not found", 404, "NOT_FOUND");
    }

    return project;
  }

  public async getProjectBySlug(slug: string) {
    const project = await this.dao.findProjectBySlug(slug);

    if (!project) {
      throw new ApplicationError("Project not found", 404, "NOT_FOUND");
    }

    return project;
  }

  public async updateProject(id: string, data: unknown) {
    const validatedData = updateProjectSchema.parse(data);

    const existingProject = await this.dao.findProjectById(id);

    if (!existingProject) {
      throw new ApplicationError("Project not found", 404, "NOT_FOUND");
    }

    if (validatedData.slug && validatedData.slug !== existingProject.slug) {
      const duplicate = await this.dao.findProjectBySlug(validatedData.slug);

      if (duplicate) {
        throw new ApplicationError(
          "Project with this slug already exists",
          409,
          "DUPLICATE_RESOURCE",
        );
      }
    }

    /*
     * Find Firebase files that need to be deleted
     * BEFORE changing the database.
     */
    const storagePathsToDelete: string[] = [];

    /*
     * 1. Hero image replacement
     */
    if (
      validatedData.heroImage?.storagePath &&
      existingProject.heroImage.storagePath &&
      validatedData.heroImage.storagePath !==
        existingProject.heroImage.storagePath
    ) {
      storagePathsToDelete.push(existingProject.heroImage.storagePath);
    }

    /*
     * 2. Gallery image removal/replacement
     *
     * Compare existing gallery paths against the new gallery paths.
     */
    if (validatedData.gallery) {
      const newGalleryPaths = new Set(
        validatedData.gallery
          .map((image) => image.storagePath)
          .filter((path): path is string => path !== undefined),
      );

      const removedGalleryPaths = existingProject.gallery
        .map((image) => image.storagePath)
        .filter((path): path is string => path !== undefined)
        .filter((path) => !newGalleryPaths.has(path));

      storagePathsToDelete.push(...removedGalleryPaths);
    }

    const updatedProject = await this.dao.updateProjectById(id, validatedData);

    if (!updatedProject) {
      throw new ApplicationError(
        "Failed to update project",
        500,
        "INTERNAL_SERVER_ERROR",
      );
    }

    /*
     * Delete old Firebase files only after the
     * MongoDB update succeeds.
     */
    await this.cleanupStorage(storagePathsToDelete);

    return updatedProject;
  }

  public async deleteProject(id: string) {
    const existingProject = await this.dao.findProjectById(id);

    if (!existingProject) {
      throw new ApplicationError("Project not found", 404, "NOT_FOUND");
    }

    const deletedProject = await this.dao.deleteProjectById(id);

    /*
     * Collect hero image + gallery files.
     */
    const storagePaths: string[] = [];

    if (existingProject.heroImage.storagePath) {
      storagePaths.push(existingProject.heroImage.storagePath);
    }

    storagePaths.push(
      ...existingProject.gallery
        .map((image) => image.storagePath)
        .filter((path): path is string => Boolean(path)),
    );

    /*
     * Delete all Firebase files after MongoDB deletion.
     */
    await this.cleanupStorage(storagePaths);

    return deletedProject;
  }
}

export const projectService = new ProjectService();
