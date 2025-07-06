import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  serverExternalPackages: ['socket.io'],
  webpack: (config) => {
    config.externals.push({
      'socket.io': 'socket.io',
    });
    return config;
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
};

export default nextConfig;
