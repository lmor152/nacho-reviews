import {
  type App,
  cert,
  getApp,
  getApps,
  initializeApp,
  applicationDefault,
} from "firebase-admin/app";
import { getFirestore, type Firestore } from "firebase-admin/firestore";

interface CachedFirestore {
  app: App;
  db: Firestore;
  settingsApplied: boolean;
}

// Persist on globalThis so module re-evaluations (Next.js standalone server,
// HMR, or test runners) re-use the same Firestore instance instead of
// re-applying settings() to an already-initialised one — which the
// firebase-admin SDK rejects with "Firestore has already been initialized".
const GLOBAL_KEY = "__nachodexFirestore";

interface NachoGlobal {
  [GLOBAL_KEY]?: CachedFirestore;
}

function getGlobal(): NachoGlobal {
  return globalThis as unknown as NachoGlobal;
}

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
  if (process.env.FIREBASE_SERVICE_ACCOUNT_JSON) return true;
  if (process.env.GOOGLE_APPLICATION_CREDENTIALS) return true;
  if (process.env.USE_FIRESTORE === "true") return true;
  // Auto-detect managed GCP runtimes — Cloud Run sets K_SERVICE,
  // App Engine sets GAE_SERVICE / GAE_APPLICATION.
  if (process.env.K_SERVICE) return true;
  if (process.env.GAE_SERVICE || process.env.GAE_APPLICATION) return true;
  return false;
}

export function getDb(): Firestore {
  const g = getGlobal();
  const cached = g[GLOBAL_KEY];
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

  // settings() can only be called once per Firestore instance. Wrap it
  // defensively in case some other code path (or an older module evaluation
  // before this cache was in place) already configured it.
  let settingsApplied = false;
  try {
    db.settings({ ignoreUndefinedProperties: true });
    settingsApplied = true;
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    if (/already been initialized|already been called/i.test(message)) {
      // Pre-configured by an earlier module load — that's fine, keep going.
      // eslint-disable-next-line no-console
      console.warn(
        "[firebase-admin] settings() was already applied; reusing existing Firestore instance",
      );
    } else {
      throw err;
    }
  }

  g[GLOBAL_KEY] = { app, db, settingsApplied };
  return db;
}
