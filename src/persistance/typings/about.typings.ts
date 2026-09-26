export interface AboutImage {
  url: string;
  alt: string;
  storagePath?: string;
}

export interface About {
  heroImage: AboutImage;

  /**
   * Sanitized HTML content for the About page overview.
   */
  overview: string;

  /**
   * Sanitized HTML content containing detailed
   * information about the company.
   */
  aboutUs: string;

  createdAt: Date;
  updatedAt: Date;
}
