/** @type {import('next').NextConfig} */
const apiProxyTarget = process.env.API_PROXY_TARGET ?? "http://localhost:8000";

const nextConfig = {
  reactStrictMode: true,
  allowedDevOrigins: ["127.0.0.1", "localhost"],
  async rewrites() {
    return [
      {
        source: "/api/auth/:path*",
        destination: `${apiProxyTarget}/api/auth/:path*`,
      },
      {
        source: "/api/analyze-space",
        destination: `${apiProxyTarget}/api/analyze-space`,
      },
      {
        source: "/api/locations/:path*",
        destination: `${apiProxyTarget}/api/locations/:path*`,
      },
      {
        source: "/api/v1/:path*",
        destination: `${apiProxyTarget}/api/v1/:path*`,
      },
    ];
  },
};

module.exports = nextConfig;
