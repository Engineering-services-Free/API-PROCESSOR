import { bucket } from "../../db/firebase.js";

export const deleteStorageFile = async (storagePath: string): Promise<void> => {
  try {
    await bucket.file(storagePath).delete();

    console.log(`Storage file deleted: ${storagePath}`);
  } catch (error: unknown) {
    const errorCode =
      typeof error === "object" && error !== null && "code" in error
        ? (error as { code?: number }).code
        : undefined;

    if (errorCode === 404) {
      console.warn(`Storage file not found: ${storagePath}`);
      return;
    }

    console.error(`Failed to delete storage file: ${storagePath}`, error);
  }
};

export const deleteStorageFiles = async (
  storagePaths: string[],
): Promise<void> => {
  await Promise.all(
    storagePaths.map((storagePath) => deleteStorageFile(storagePath)),
  );
};
