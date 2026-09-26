import {
  ServiceCapability,
  ServiceFaq,
  ServiceImage,
  ServiceProcessStep,
  ServiceSeo,
  ServiceStatus,
} from "./service.typings";

export interface CreateServiceInput {
  title: string;
  slug: string;
  tagline?: string;
  shortDescription: string;

  heroImage: ServiceImage;

  summary: string[];
  overview: string;
  detail: string;

  capabilities: ServiceCapability[];
  technologies: string[];
  industries: string[];
  deliverables: string[];
  process: ServiceProcessStep[];
  benefits: string[];
  faqs: ServiceFaq[];

  status?: ServiceStatus;
  featured?: boolean;
  order?: number;

  seo?: ServiceSeo;
}
