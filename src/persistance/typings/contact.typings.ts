export interface ContactSocialMedia {
  platform: string;
  url: string;
}

export interface ContactLocation {
  mapUrl: string;
}

export interface Contact {
  contactNumber1: string;

  contactNumber2?: string;

  whatsappNumber: string;

  email: string;

  socialMedia: ContactSocialMedia[];

  location: ContactLocation;

  createdAt: Date;
  updatedAt: Date;
}
