import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  serverExternalPackages: [
    "@prisma/client",
    "@prisma/adapter-pg",
    "pg",
    // Mark the generated Prisma client as server-external
    // to prevent Turbopack from bundling it into the browser
  ],
  experimental: {
    // Ensures server-only packages are not bundled for the client
  },
};

export default nextConfig;
