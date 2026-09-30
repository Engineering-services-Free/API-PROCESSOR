export interface FounderImage {
  url: string;
  alt: string;
  storagePath?: string;
}

export interface Founder {
  name: string;
  image: FounderImage;
  overview: string; //text area
  experience: string; //Html content
  order: number;
  createdAt: Date;
  updatedAt: Date;
}