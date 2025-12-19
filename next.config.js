/** @type {import('next').NextConfig} */

const nextConfig = {
  reactStrictMode: false,
  swcMinify: true,
  basePath: process.env.NEXT_PUBLIC_BASE_PATH,
  assetPrefix: process.env.NEXT_PUBLIC_BASE_PATH,
  reactStrictMode: false,
  async rewrites() {
    return [
      {
        source: '/api/sessions/create',
        destination:
          'http://34.87.2.178:4501/deployments/MyDeployment/sessions/create', // Proxy to Backend for session creation
      },
      {
        source: '/api/tasks/run',
        destination:
          'http://34.87.2.178:4501/deployments/MyDeployment/tasks/run', // Proxy to Backend for running tasks
      },
      {
        source: '/auth/:path*',
        destination: 'https://v2.humac.live/api/auth/:path*', // New proxy for authentication
      },
    ];
  },
  typescript: {
    ignoreBuildErrors: true, // Ignores TypeScript errors during build
  },
  eslint: {
    ignoreDuringBuilds: true, // Ignores ESLint errors during build
  },
  images: {
    domains: [
      'images.unsplash.com',
      'i.ibb.co',
      'scontent.fotp8-1.fna.fbcdn.net',
    ],
    // Make ENV
    unoptimized: true,
  },
};

module.exports = nextConfig;
