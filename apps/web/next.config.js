// Importing env files here to validate on build
import "./src/env.js";
import "@niceai/auth/env";

/** @type {import("next").NextConfig} */
const config = {
  reactStrictMode: true,

  /** Enables hot reloading for local packages without a build step */
  transpilePackages: [
    "@niceai/api",
    "@niceai/auth",
    "@niceai/db",
    "@niceai/ui",
    "@niceai/trpc",
    "@niceai/validators",
  ],

  /** We already do linting and typechecking as separate tasks in CI */
  eslint: { ignoreDuringBuilds: true },
  typescript: { ignoreBuildErrors: true },
};

export default config;
