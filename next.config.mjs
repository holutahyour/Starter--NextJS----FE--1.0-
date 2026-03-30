/** @type {import('next').NextConfig} */
const nextConfig = {
  // experimental: {
  //   optimizePackageImports: ["@chakra-ui/react"],
  // },

  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  async rewrites() {
    return [
      {
        source: '/api/proxy/:path*',
        // Proxy to your HTTP backend
        destination: `${process.env.BACKEND_API_URL || 'http://localhost:7290/api/v1'}/:path*`, 
      },
    ];
  },
};

export default nextConfig;
