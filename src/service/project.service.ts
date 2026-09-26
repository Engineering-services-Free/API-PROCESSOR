import { ApplicationError } from "../common/errors/application.error.js";
import {
  deleteStorageFile,
  deleteStorageFiles,
} from "../common/storage/storage.js";
import {
  projectSchema,
  updateProjectSchema,
  projectQuerySchema,
} from "../common/validators/service.validator.js";
import { ProjectDao, projectDao } from "../daos/project.dao.js";

export class ProjectService {
  constructor(private readonly dao: ProjectDao = projectDao) {}

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

    return this.dao.findProjects({
      page: validatedQuery.page,
      limit: validatedQuery.limit,
      filter: {
        status: validatedQuery.status,
        featured: validatedQuery.featured,
        industry: validatedQuery.industry,
      },
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
     * Find Firebase files that need to be
     * deleted BEFORE changing the database.
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
     * Compare existing gallery paths against
     * the new gallery paths.
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

    /*
     * Delete old Firebase files only after
     * MongoDB update succeeds.
     */
    if (storagePathsToDelete.length > 0) {
      await deleteStorageFiles(storagePathsToDelete);
    }

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
     * Delete all Firebase files after
     * MongoDB deletion.
     */
    if (storagePaths.length > 0) {
      await deleteStorageFiles(storagePaths);
    }

    return deletedProject;
  }
}

export const projectService = new ProjectService();
