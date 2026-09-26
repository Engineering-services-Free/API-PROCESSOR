export interface FounderImage {
  url: string;
  alt: string;
  storagePath?: string;
}

export interface Founder {
  name: string;

  image: FounderImage;

  overview: string;

  /**
   * Sanitized HTML content containing the founder's
   * professional experience and career journey.
   */
  experience: string;

  createdAt: Date;
  updatedAt: Date;
}
