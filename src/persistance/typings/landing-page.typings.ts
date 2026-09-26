export interface LandingHero {
  title: string;
  description?: string;
}

export interface LandingPage {
  hero: LandingHero;

  /**
   * Sanitized HTML content describing
   * what the company does and its capabilities.
   */
  whatWeDo: string;

  createdAt: Date;
  updatedAt: Date;
}
