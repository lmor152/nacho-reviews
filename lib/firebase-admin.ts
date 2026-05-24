import {
  type App,
  cert,
  getApp,
  getApps,
  initializeApp,
  applicationDefault,
} from "firebase-admin/app";
import { getFirestore, type Firestore } from "firebase-admin/firestore";

let cached: { app: App; db: Firestore } | null = null;

function loadServiceAccount(): Record<string, unknown> | null {
  const inline = process.env.FIREBASE_SERVICE_ACCOUNT_JSON;
  if (inline) {
    try {
      return JSON.parse(inline) as Record<string, unknown>;
    } catch (err) {
      throw new Error(
        `FIREBASE_SERVICE_ACCOUNT_JSON is not valid JSON: ${(err as Error).message}`,
      );
    }
  }
  return null;
}

export function isFirestoreConfigured(): boolean {
  // Explicit credentials (preferred for local development).
  if (process.env.FIREBASE_SERVICE_ACCOUNT_JSON) return true;
  if (process.env.GOOGLE_APPLICATION_CREDENTIALS) return true;
  // Manual override.
  if (process.env.USE_FIRESTORE === "true") return true;
  // Auto-detect managed GCP runtimes — Cloud Run sets K_SERVICE,
  // App Engine sets GAE_SERVICE / GAE_APPLICATION, GKE/GCE expose
  // FUNCTION_NAME or similar. In any of these the firebase-admin SDK
  // can use the attached service account via applicationDefault().
  if (process.env.K_SERVICE) return true;
  if (process.env.GAE_SERVICE || process.env.GAE_APPLICATION) return true;
  return false;
}

export function getDb(): Firestore {
  if (cached) return cached.db;

  let app: App;
  if (getApps().length > 0) {
    app = getApp();
  } else {
    const serviceAccount = loadServiceAccount();
    const projectId =
      process.env.GOOGLE_CLOUD_PROJECT ??
      process.env.GCLOUD_PROJECT ??
      undefined;
    app = initializeApp({
      credential: serviceAccount
        ? cert(serviceAccount as Parameters<typeof cert>[0])
        : applicationDefault(),
      projectId,
    });
  }

  const databaseId = process.env.FIRESTORE_DATABASE_ID;
  const db = databaseId ? getFirestore(app, databaseId) : getFirestore(app);
  db.settings({ ignoreUndefinedProperties: true });
  cached = { app, db };
  return db;
}
