export interface ClientImage {
  url: string;
  alt: string;
  storagePath?: string;
}

export interface Client {
  name: string;
  image: ClientImage;
  industry: string;

  createdAt: Date;
  updatedAt: Date;
}
