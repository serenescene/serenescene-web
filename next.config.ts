import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async redirects() {
    return [
      {
        source: "/master",
        destination: "/master/login",
        permanent: false,
      },
    ];
  },
};

export default nextConfig;
