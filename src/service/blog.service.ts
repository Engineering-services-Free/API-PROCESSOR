import { ApplicationError } from "../common/errors/application.error.js";
import { deleteStorageFile } from "../common/storage/storage.js";
import {
  blogSchema,
  updateBlogSchema,
  blogQuerySchema,
} from "../common/validators/service.validator.js";
import { BlogDao, blogDao } from "../daos/blog.dao.js";

export class BlogService {
  constructor(private readonly dao: BlogDao = blogDao) {}

  public async createBlog(data: unknown) {
    const validatedData = blogSchema.parse(data);

    const existingBlog = await this.dao.findBlogBySlug(validatedData.slug);

    if (existingBlog) {
      throw new ApplicationError(
        "Blog with this slug already exists",
        409,
        "DUPLICATE_RESOURCE",
      );
    }

    return this.dao.createBlog(validatedData);
  }

  public async getBlogs(query: unknown) {
    const validatedQuery = blogQuerySchema.parse(query);

    const filter: {
      status?: "draft" | "published" | "archived";
      featured?: boolean;
      projectId?: string;
    } = {};

    if (validatedQuery.status !== undefined) {
      filter.status = validatedQuery.status;
    }

    if (validatedQuery.featured !== undefined) {
      filter.featured = validatedQuery.featured;
    }

    if (validatedQuery.projectId !== undefined) {
      filter.projectId = validatedQuery.projectId;
    }

    return this.dao.findBlogs({
      page: validatedQuery.page,
      limit: validatedQuery.limit,
      filter,
    });
  }

  public async getBlogById(id: string) {
    const blog = await this.dao.findBlogById(id);

    if (!blog) {
      throw new ApplicationError("Blog not found", 404, "NOT_FOUND");
    }

    return blog;
  }

  public async getBlogBySlug(slug: string) {
    const blog = await this.dao.findBlogBySlug(slug);

    if (!blog) {
      throw new ApplicationError("Blog not found", 404, "NOT_FOUND");
    }

    return blog;
  }

  public async updateBlog(id: string, data: unknown) {
    const validatedData = updateBlogSchema.parse(data);

    const existingBlog = await this.dao.findBlogById(id);

    if (!existingBlog) {
      throw new ApplicationError("Blog not found", 404, "NOT_FOUND");
    }

    if (validatedData.slug && validatedData.slug !== existingBlog.slug) {
      const duplicate = await this.dao.findBlogBySlug(validatedData.slug);

      if (duplicate) {
        throw new ApplicationError(
          "Blog with this slug already exists",
          409,
          "DUPLICATE_RESOURCE",
        );
      }
    }

    const updatedBlog = await this.dao.updateBlogById(id, validatedData);

    /*
     * Delete the old Firebase cover image
     * only when a different image was provided.
     */
    if (
      validatedData.coverImage?.storagePath &&
      existingBlog.coverImage.storagePath &&
      validatedData.coverImage.storagePath !==
        existingBlog.coverImage.storagePath
    ) {
      await deleteStorageFile(existingBlog.coverImage.storagePath);
    }

    return updatedBlog;
  }

  public async deleteBlog(id: string) {
    const existingBlog = await this.dao.findBlogById(id);

    if (!existingBlog) {
      throw new ApplicationError("Blog not found", 404, "NOT_FOUND");
    }

    const deletedBlog = await this.dao.deleteBlogById(id);

    /*
     * Delete Firebase cover image after
     * MongoDB document deletion.
     */
    if (existingBlog.coverImage.storagePath) {
      await deleteStorageFile(existingBlog.coverImage.storagePath);
    }

    return deletedBlog;
  }
}

export const blogService = new BlogService();
