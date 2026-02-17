import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  experimental: {
    optimizePackageImports: ["@chakra-ui/react"],
  },
  images: {
    domains: ['cdn.dummyjson.com'], // دامنه‌های مجاز برای تصاویر
  }
};

export default nextConfig;
