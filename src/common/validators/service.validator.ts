import { z } from "zod";

/* 
   COMMON
 */

export const objectIdSchema = z.object({
  id: z.string().regex(/^[0-9a-fA-F]{24}$/, "Invalid ID"),
});

export const paginationSchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(10),
});

/* 
   SERVICE
 */

export const serviceSchema = z.object({
  title: z.string().min(1).max(200),

  slug: z.string().min(1).max(200),

  tagline: z.string().max(300).optional(),

  shortDescription: z.string().min(1).max(500),

  heroImage: z.object({
    url: z.string().url(),
    alt: z.string().min(1),
    storagePath: z.string().optional(),
  }),

  summary: z.array(z.string().min(1)),

  overview: z.string().min(1),

  detail: z.string().min(1),

  capabilities: z.array(
    z.object({
      title: z.string().min(1),
      description: z.string().min(1),
      icon: z.string().optional(),
    }),
  ),

  technologies: z.array(z.string().min(1)),

  industries: z.array(z.string().min(1)),

  deliverables: z.array(z.string().min(1)),

  process: z.array(
    z.object({
      step: z.number().int().positive(),
      title: z.string().min(1),
      description: z.string().min(1),
    }),
  ),

  benefits: z.array(z.string().min(1)),

  faqs: z.array(
    z.object({
      question: z.string().min(1),
      answer: z.string().min(1),
    }),
  ),

  status: z.enum(["draft", "published", "archived"]),

  featured: z.boolean(),

  order: z.number().int().nonnegative(),

  seo: z
    .object({
      metaTitle: z.string().max(70).optional(),
      metaDescription: z.string().max(160).optional(),
      keywords: z.array(z.string()),
    })
    .optional(),
});

export const updateServiceSchema = z.object({
  title: serviceSchema.shape.title.optional(),
  slug: serviceSchema.shape.slug.optional(),
  tagline: serviceSchema.shape.tagline.optional(),
  shortDescription: serviceSchema.shape.shortDescription.optional(),

  heroImage: serviceSchema.shape.heroImage.partial().optional(),

  summary: serviceSchema.shape.summary.optional(),
  overview: serviceSchema.shape.overview.optional(),
  detail: serviceSchema.shape.detail.optional(),
  capabilities: serviceSchema.shape.capabilities.optional(),
  technologies: serviceSchema.shape.technologies.optional(),
  industries: serviceSchema.shape.industries.optional(),
  deliverables: serviceSchema.shape.deliverables.optional(),
  process: serviceSchema.shape.process.optional(),
  benefits: serviceSchema.shape.benefits.optional(),
  faqs: serviceSchema.shape.faqs.optional(),
  status: serviceSchema.shape.status.optional(),
  featured: serviceSchema.shape.featured.optional(),
  order: serviceSchema.shape.order.optional(),
  seo: serviceSchema.shape.seo.optional(),
});

export const serviceQuerySchema = z.object({
  page: z.coerce.number().int().min(1).default(1),

  limit: z.coerce.number().int().min(1).max(100).default(10),

  status: z.enum(["draft", "published", "archived"]).optional(),

  featured: z.coerce.boolean().optional(),
});

export const serviceIdSchema = z.object({
  id: z.string().regex(/^[0-9a-fA-F]{24}$/, "Invalid service ID"),
});

export const serviceSlugSchema = z.object({
  slug: z.string().min(1),
});

/* 
   PROJECT
 */

export const projectSchema = z.object({
  title: z.string().min(1).max(200),
  slug: z.string().min(1).max(200),

  clientId: z.string().regex(/^[0-9a-fA-F]{24}$/),

  industry: z.string().min(1),
  location: z.string().optional(),

  shortDescription: z.string().min(1).max(500),
  overview: z.string().min(1),

  heroImage: z.object({
    url: z.string().url(),
    alt: z.string().min(1),
    storagePath: z.string().optional(),
  }),

  gallery: z.array(
    z.object({
      url: z.string().url(),
      alt: z.string().min(1),
      storagePath: z.string().optional(),
    }),
  ),

  challenge: z.string().min(1),
  solution: z.string().min(1),

  engineeringScope: z.array(z.string().min(1)),
  technologies: z.array(z.string().min(1)),

  results: z.array(
    z.object({
      metric: z.string().min(1),
      value: z.string().min(1),
      description: z.string().optional(),
    }),
  ),

  duration: z.string().optional(),

  year: z.number().int().min(1900).max(2100),

  status: z.enum(["draft", "published", "archived"]),

  featured: z.boolean(),
  order: z.number().int().nonnegative(),

  relatedServices: z.array(z.string().regex(/^[0-9a-fA-F]{24}$/)),

  seo: z
    .object({
      metaTitle: z.string().max(70).optional(),
      metaDescription: z.string().max(160).optional(),
      keywords: z.array(z.string()),
    })
    .optional(),
});

export const updateProjectSchema = z.object({
  title: projectSchema.shape.title.optional(),

  slug: projectSchema.shape.slug.optional(),

  clientId: projectSchema.shape.clientId.optional(),

  industry: projectSchema.shape.industry.optional(),

  location: projectSchema.shape.location.optional(),

  shortDescription: projectSchema.shape.shortDescription.optional(),

  overview: projectSchema.shape.overview.optional(),

  heroImage: projectSchema.shape.heroImage.partial().optional(),

  gallery: z.array(projectSchema.shape.gallery.element.partial()).optional(),

  challenge: projectSchema.shape.challenge.optional(),

  solution: projectSchema.shape.solution.optional(),

  engineeringScope: projectSchema.shape.engineeringScope.optional(),

  technologies: projectSchema.shape.technologies.optional(),

  results: projectSchema.shape.results.optional(),

  duration: projectSchema.shape.duration.optional(),

  year: projectSchema.shape.year.optional(),

  status: projectSchema.shape.status.optional(),

  featured: projectSchema.shape.featured.optional(),

  order: projectSchema.shape.order.optional(),

  relatedServices: projectSchema.shape.relatedServices.optional(),

  seo: projectSchema.shape.seo.unwrap().partial().optional(),
});

export const projectQuerySchema = paginationSchema.extend({
  status: z.enum(["draft", "published", "archived"]).optional(),
  featured: z.coerce.boolean().optional(),
  industry: z.string().optional(),
});

export const projectSlugSchema = z.object({
  slug: z.string().min(1),
});

/* 
   CLIENT
 */

export const clientSchema = z.object({
  name: z.string().min(1).max(200),

  image: z.object({
    url: z.string().url(),
    alt: z.string().min(1),
    storagePath: z.string().optional(),
  }),

  industry: z.string().min(1),
});

export const updateClientSchema = z.object({
  name: clientSchema.shape.name.optional(),

  image: clientSchema.shape.image.partial().optional(),

  industry: clientSchema.shape.industry.optional(),
});

export const clientQuerySchema = paginationSchema.extend({
  industry: z.string().optional(),
});

/* 
   BLOG
 */

export const blogSchema = z.object({
  title: z.string().min(1).max(200),
  slug: z.string().min(1).max(200),

  shortDescription: z.string().min(1).max(500),

  overview: z.string().min(1),

  coverImage: z.object({
    url: z.string().url(),
    alt: z.string().min(1),
    storagePath: z.string().optional(),
  }),

  content: z.string().min(1),

  projectId: z.string().regex(/^[0-9a-fA-F]{24}$/),

  technologies: z.array(z.string().min(1)),
  keyTakeaways: z.array(z.string().min(1)),

  readingTime: z.number().int().positive(),

  status: z.enum(["draft", "published", "archived"]),

  featured: z.boolean(),
  order: z.number().int().nonnegative(),

  publishedAt: z.coerce.date().optional(),

  seo: z
    .object({
      metaTitle: z.string().max(70).optional(),
      metaDescription: z.string().max(160).optional(),
      keywords: z.array(z.string()),
    })
    .optional(),
});

export const updateBlogSchema = z.object({
  title: blogSchema.shape.title.optional(),

  slug: blogSchema.shape.slug.optional(),

  shortDescription: blogSchema.shape.shortDescription.optional(),

  overview: blogSchema.shape.overview.optional(),

  coverImage: blogSchema.shape.coverImage.partial().optional(),

  content: blogSchema.shape.content.optional(),

  projectId: blogSchema.shape.projectId.optional(),

  technologies: blogSchema.shape.technologies.optional(),

  keyTakeaways: blogSchema.shape.keyTakeaways.optional(),

  readingTime: blogSchema.shape.readingTime.optional(),

  status: blogSchema.shape.status.optional(),

  featured: blogSchema.shape.featured.optional(),

  order: blogSchema.shape.order.optional(),

  publishedAt: blogSchema.shape.publishedAt.optional(),

  seo: blogSchema.shape.seo.unwrap().partial().optional(),
});

export const blogQuerySchema = paginationSchema.extend({
  status: z.enum(["draft", "published", "archived"]).optional(),
  featured: z.coerce.boolean().optional(),
  projectId: z
    .string()
    .regex(/^[0-9a-fA-F]{24}$/)
    .optional(),
});

export const blogSlugSchema = z.object({
  slug: z.string().min(1),
});

/* 
   FOUNDER
 */

export const founderSchema = z.object({
  name: z.string().min(1).max(200),

  image: z.object({
    url: z.string().url(),
    alt: z.string().min(1),
    storagePath: z.string().optional(),
  }),

  overview: z.string().min(1),

  experience: z.string().min(1),

  order: z.number().int().nonnegative(),
});

export const updateFounderSchema = z.object({
  name: founderSchema.shape.name.optional(),

  image: founderSchema.shape.image.partial().optional(),

  overview: founderSchema.shape.overview.optional(),

  experience: founderSchema.shape.experience.optional(),

  order: founderSchema.shape.order.optional(),
});

/* 
   ABOUT
 */

export const aboutSchema = z.object({
  overview: z.string().min(1),
  aboutUs: z.string().min(1),
});

export const updateAboutSchema = aboutSchema.partial();

/* 
   LANDING PAGE
 */

export const landingPageSchema = z.object({
  hero: z.object({
    title: z.string().min(1).max(200),
    description: z.string().optional(),
  }),

  whatWeDo: z.string().min(1),
});

export const updateLandingPageSchema = landingPageSchema.partial();

/* 
   CONTACT
 */

export const contactSchema = z.object({
  contactNumber1: z.string().min(5).max(30),

  contactNumber2: z.string().min(5).max(30).optional(),

  whatsappNumber: z.string().min(5).max(30),

  email: z.string().email(),

  socialMedia: z.array(
    z.object({
      platform: z.string().min(1),
      url: z.string().url(),
    }),
  ),

  location: z.object({
    mapUrl: z.string().url(),
  }),
});

export const updateContactSchema = contactSchema.partial();

/* 
   DOCUMENT
 */

export const documentSchema = z.object({
  title: z.string().min(1).max(200),

  type: z.enum([
    "brochure",
    "certificate",
    "company-profile",
    "presentation",
    "other",
  ]),

  description: z.string().optional(),

  file: z.object({
    url: z.string().url(),
    storagePath: z.string().min(1),
  }),

  visibility: z.enum(["public", "internal"]),

  order: z.number().int().nonnegative(),
});

export const updateDocumentSchema = z.object({
  title: documentSchema.shape.title.optional(),

  type: documentSchema.shape.type.optional(),

  description: documentSchema.shape.description.optional(),

  file: documentSchema.shape.file.partial().optional(),

  visibility: documentSchema.shape.visibility.optional(),

  order: documentSchema.shape.order.optional(),
});

export const documentQuerySchema = paginationSchema.extend({
  type: z
    .enum([
      "brochure",
      "certificate",
      "company-profile",
      "presentation",
      "other",
    ])
    .optional(),

  visibility: z.enum(["public", "internal"]).optional(),
});

/* 
   INFERRED TYPES
 */

/* SERVICE */

export type CreateServiceInput = z.infer<typeof serviceSchema>;

export type UpdateServiceInput = z.infer<typeof updateServiceSchema>;

export type ServiceQuery = z.infer<typeof serviceQuerySchema>;

/* PROJECT */

export type CreateProjectInput = z.infer<typeof projectSchema>;

export type UpdateProjectInput = z.infer<typeof updateProjectSchema>;

export type ProjectQuery = z.infer<typeof projectQuerySchema>;

/* CLIENT */

export type CreateClientInput = z.infer<typeof clientSchema>;

export type UpdateClientInput = z.infer<typeof updateClientSchema>;

export type ClientQuery = z.infer<typeof clientQuerySchema>;

/* BLOG */

export type CreateBlogInput = z.infer<typeof blogSchema>;

export type UpdateBlogInput = z.infer<typeof updateBlogSchema>;

export type BlogQuery = z.infer<typeof blogQuerySchema>;

/* FOUNDER */

export type CreateFounderInput = z.infer<typeof founderSchema>;

export type UpdateFounderInput = z.infer<typeof updateFounderSchema>;

/* ABOUT */

export type CreateAboutInput = z.infer<typeof aboutSchema>;

export type UpdateAboutInput = z.infer<typeof updateAboutSchema>;

/* LANDING PAGE */

export type CreateLandingPageInput = z.infer<typeof landingPageSchema>;

export type UpdateLandingPageInput = z.infer<typeof updateLandingPageSchema>;

/* CONTACT */

export type CreateContactInput = z.infer<typeof contactSchema>;

export type UpdateContactInput = z.infer<typeof updateContactSchema>;

/* DOCUMENT */

export type CreateDocumentInput = z.infer<typeof documentSchema>;

export type UpdateDocumentInput = z.infer<typeof updateDocumentSchema>;

export type DocumentQuery = z.infer<typeof documentQuerySchema>;
