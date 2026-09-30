import { UpdateQuery } from "mongoose";
import {
  PaginatedResult,
  PaginationQuery,
} from "../common/pagination/pagination.types";
import { Blog } from "../persistance/typings";
import { BlogModel } from "../persistance/model";
import {
  CreateBlogInput,
  UpdateBlogInput,
} from "../common/validators/service.validator";

export interface FindBlogsFilter {
  status?: "draft" | "published" | "archived";
  featured?: boolean;
  projectId?: string;
}

export interface FindBlogsOptions extends PaginationQuery {
  filter?: FindBlogsFilter;
}

export class BlogDao {
  public async createBlog(data: CreateBlogInput): Promise<Blog> {
    return BlogModel.create(data);
  }

  public async findBlogs(
  options: FindBlogsOptions,
): Promise<PaginatedResult<Blog>> {
  const { page, limit, filter = {} } = options; 

  const skip = (page - 1) * limit;

  const [items, total] = await Promise.all([
    BlogModel.find(filter)
      .sort({
        publishedAt: -1,
        order: 1,
        createdAt: -1,
      })
      .skip(skip)
      .limit(limit)
      .lean<Blog[]>()
      .exec(),

    BlogModel.countDocuments(filter).exec(),
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

  public async findBlogById(id: string): Promise<Blog | null> {
    return BlogModel.findById(id).lean<Blog>().exec();
  }

  public async findBlogBySlug(slug: string): Promise<Blog | null> {
    return BlogModel.findOne({ slug }).lean<Blog>().exec();
  }

  public async updateBlogById(
    id: string,
    data: UpdateBlogInput,
  ): Promise<Blog | null> {
    return BlogModel.findByIdAndUpdate(id, data, {
      new: true,
      runValidators: true,
    })
      .lean<Blog>()
      .exec();
  }

  public async deleteBlogById(id: string): Promise<Blog | null> {
    return BlogModel.findByIdAndDelete(id).lean<Blog>().exec();
  }
}

export const blogDao = new BlogDao();
