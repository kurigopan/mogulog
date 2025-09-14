import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "placehold.co",
      },
      {
        protocol: "https",
        hostname: "whwkxauhckazffxkgehp.supabase.co",
      },
    ],
  },
};

export default nextConfig;
