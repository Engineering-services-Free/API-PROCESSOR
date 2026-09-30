export type StorageUploadOptions = {
  folder: string;
  fileName: string;
  contentType: string;
};

export type StorageUploadResult = {
  url: string;
  storagePath: string;
};
