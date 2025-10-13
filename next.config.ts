import type { NextConfig } from "next";
import withPWA from "@ducanh2912/next-pwa";

const nextConfig: NextConfig = {
  /* config options here */
  eslint: {
    // Warning: This allows production builds to successfully complete even if
    // your project has ESLint errors. Only enable during development.
    ignoreDuringBuilds: true,
  },
  typescript: {
    // !! WARN !!
    // Allow production builds even with type errors (temporary during refactoring)
    // ignoreBuildErrors: true,
  },
};

export default withPWA({
  dest: "public",
  cacheOnFrontEndNav: true,
  aggressiveFrontEndNavCaching: true,
  reloadOnOnline: true,
  disable: process.env.NODE_ENV === "development",
  workboxOptions: {
    disableDevLogs: true,
  },
})(nextConfig);
