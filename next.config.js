/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  async rewrites() {
    return [
      {
        source: '/home',
        destination: '/',
      },
    ];
  },
  env: {
    LIVE_ENDPOINT_URL: process.env.LIVE_ENDPOINT_URL,
    UPCOMING_ENDPOINT_URL: process.env.UPCOMING_ENDPOINT_URL,
  },
}

module.exports = nextConfig