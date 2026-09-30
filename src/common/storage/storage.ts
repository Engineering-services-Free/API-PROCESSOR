import { bucket } from "../../db/firebase.js";

import type {
  StorageUploadOptions,
  StorageUploadResult,
} from "./storage.types.js";

export const uploadStorageFile = async (
  buffer: Buffer,
  options: StorageUploadOptions,
): Promise<StorageUploadResult> => {
  const storagePath = `${options.folder}/${options.fileName}`;

  const file = bucket.file(storagePath);

  await file.save(buffer, {
    metadata: {
      contentType: options.contentType,
    },
    resumable: false,
  });

  const [url] = await file.getSignedUrl({
    action: "read",
    expires: "03-09-2491",
  });

  console.log(`Storage file uploaded: ${storagePath}`);

  return {
    url,
    storagePath,
  };
};

export const deleteStorageFile = async (storagePath: string): Promise<void> => {
  try {
    if (!storagePath) {
      console.warn("Storage path is empty. Skipping deletion.");
      return;
    }

    console.log(`Attempting to delete storage file: ${storagePath}`);

    await bucket.file(storagePath).delete();

    console.log(`Storage file deleted successfully: ${storagePath}`);
  } catch (error: unknown) {
    const errorCode =
      typeof error === "object" && error !== null && "code" in error
        ? (error as { code?: number | string }).code
        : undefined;

    if (errorCode === 404 || errorCode === "404") {
      console.warn(`Storage file not found: ${storagePath}`);
      return;
    }

    console.error(`Failed to delete storage file: ${storagePath}`, error);

    throw error;
  }
};

export const deleteStorageFiles = async (
  storagePaths: string[],
): Promise<void> => {
  await Promise.all(
    storagePaths.map((storagePath) => deleteStorageFile(storagePath)),
  );
};
