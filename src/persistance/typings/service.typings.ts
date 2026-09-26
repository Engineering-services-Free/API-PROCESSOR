export type ServiceStatus = "draft" | "published" | "archived";

export interface ServiceImage {
  url: string;
  alt: string;
  storagePath?: string;
}

export interface ServiceCapability {
  title: string;
  description: string;
  icon?: string;
}

export interface ServiceProcessStep {
  step: number;
  title: string;
  description: string;
}

export interface ServiceFaq {
  question: string;
  answer: string;
}

export interface ServiceSeo {
  metaTitle?: string;
  metaDescription?: string;
  keywords: string[];
}

export interface Service {
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

  status: ServiceStatus;
  featured: boolean;
  order: number;

  seo?: ServiceSeo;

  createdAt: Date;
  updatedAt: Date;
}
