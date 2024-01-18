// Importing env files here to validate on build
import "./src/env.js";
import "@niceai/auth/env";

/** @type {import("next").NextConfig} */
const config = {
  reactStrictMode: false,

  /** Enables hot reloading for local packages without a build step */
  transpilePackages: [
    "@niceai/api",
    "@niceai/api2",
    "@niceai/auth",
    "@niceai/db",
    "@niceai/trpc",
    "@niceai/validators",
  ],

  /**
   * If you have `experimental: { appDir: true }` set, then you must comment the below `i18n` config
   * out.
   *
   * @see https://github.com/vercel/next.js/issues/41980
   */
  i18n: {
    locales: ["en"],
    defaultLocale: "en",
  },

  /** We already do linting and typechecking as separate tasks in CI */
  eslint: { ignoreDuringBuilds: true },
  typescript: { ignoreBuildErrors: true },
};

export default config;
