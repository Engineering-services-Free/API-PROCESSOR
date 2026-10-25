import type { Model, PipelineStage } from "mongoose";

import {
  BlogModel,
  ClientModel,
  ProjectModel,
  ServiceModel,
} from "../persistance/model/index.js";
import type { Blog, Client, Project, Service } from "../persistance/typings/index.js";

interface DashboardRecord {
  id: string;
  createdAt: Date;
}

export interface DashboardServiceRecord extends DashboardRecord {
  title: string;
  slug: string;
  status: Service["status"];
}

export interface DashboardProjectRecord extends DashboardRecord {
  title: string;
  slug: string;
  status: Project["status"];
  year: number;
}

export interface DashboardClientRecord extends DashboardRecord {
  name: string;
  industry: string;
}

export interface DashboardBlogRecord extends DashboardRecord {
  title: string;
  slug: string;
  status: Blog["status"];
}

export interface DashboardData {
  counts: {
    services: number;
    projects: number;
    clients: number;
    blogs: number;
  };
  recent: {
    services: DashboardServiceRecord[];
    projects: DashboardProjectRecord[];
    clients: DashboardClientRecord[];
    blogs: DashboardBlogRecord[];
  };
}

interface DashboardAggregate<RecordType> {
  counts: { total: number }[];
  recent: RecordType[];
}

interface DashboardSummary<RecordType> {
  count: number;
  recent: RecordType[];
}

function createDashboardPipeline(fields: Record<string, 1>): PipelineStage[] {
  return [
    {
      $sort: {
        createdAt: -1,
        _id: -1,
      },
    },
    {
      $facet: {
        counts: [{ $count: "total" }],
        recent: [
          { $limit: 5 },
          {
            $project: {
              _id: 0,
              id: { $toString: "$_id" },
              createdAt: 1,
              ...fields,
            },
          },
        ],
      },
    },
  ];
}

export class DashboardDao {
  private async getCollectionSummary<Source, RecordType extends DashboardRecord>(
    model: Model<Source>,
    fields: Record<string, 1>,
  ): Promise<DashboardSummary<RecordType>> {
    const [result] = await model
      .aggregate<DashboardAggregate<RecordType>>(
        createDashboardPipeline(fields),
      )
      .exec();

    return {
      count: result?.counts[0]?.total ?? 0,
      recent: result?.recent ?? [],
    };
  }

  public async getDashboard(): Promise<DashboardData> {
    const [services, projects, clients, blogs] = await Promise.all([
      this.getCollectionSummary<Service, DashboardServiceRecord>(ServiceModel, {
        title: 1,
        slug: 1,
        status: 1,
      }),
      this.getCollectionSummary<Project, DashboardProjectRecord>(ProjectModel, {
        title: 1,
        slug: 1,
        status: 1,
        year: 1,
      }),
      this.getCollectionSummary<Client, DashboardClientRecord>(ClientModel, {
        name: 1,
        industry: 1,
      }),
      this.getCollectionSummary<Blog, DashboardBlogRecord>(BlogModel, {
        title: 1,
        slug: 1,
        status: 1,
      }),
    ]);

    return {
      counts: {
        services: services.count,
        projects: projects.count,
        clients: clients.count,
        blogs: blogs.count,
      },
      recent: {
        services: services.recent,
        projects: projects.recent,
        clients: clients.recent,
        blogs: blogs.recent,
      },
    };
  }
}

export const dashboardDao = new DashboardDao();
