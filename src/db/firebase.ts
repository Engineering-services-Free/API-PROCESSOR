import { cert, getApps, initializeApp } from "firebase-admin/app";
import { getStorage } from "firebase-admin/storage";

const projectId = process.env.FIREBASE_PROJECT_ID;
const clientEmail = process.env.FIREBASE_CLIENT_EMAIL;
const privateKey = process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, "\n");
const storageBucket = process.env.FIREBASE_STORAGE_BUCKET;

if (!projectId) {
  throw new Error("FIREBASE_PROJECT_ID is not defined");
}

if (!clientEmail) {
  throw new Error("FIREBASE_CLIENT_EMAIL is not defined");
}

if (!privateKey) {
  throw new Error("FIREBASE_PRIVATE_KEY is not defined");
}

if (!storageBucket) {
  throw new Error("FIREBASE_STORAGE_BUCKET is not defined");
}

const firebaseApp =
  getApps().length > 0
    ? getApps()[0]
    : initializeApp({
        credential: cert({
          projectId,
          clientEmail,
          privateKey,
        }),
        storageBucket,
      });

export const bucket = getStorage(firebaseApp).bucket();
