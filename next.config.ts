import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "standalone",
  poweredByHeader: false,
  // Keep the Firestore admin SDK out of the server bundle so the standalone
  // output traces it correctly at build time.
  serverExternalPackages: ["firebase-admin", "@google-cloud/firestore"],
};

export default nextConfig;
