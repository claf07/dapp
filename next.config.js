/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  webpack: (config) => {
    config.resolve.fallback = {
      ...config.resolve.fallback,
      fs: false,
      net: false,
      tls: false,
    };
    return config;
  },
  env: {
    NEXT_PUBLIC_INFURA_PROJECT_ID: "local_test",
    NEXT_PUBLIC_INFURA_PROJECT_SECRET: "local_test",
  },
  async headers() {
    const isDev = process.env.NODE_ENV === 'development';
    return [
      {
        source: '/(.*)',
        headers: isDev
          ? [
              {
                key: 'Content-Security-Policy',
                value: "script-src 'self' 'unsafe-eval' 'unsafe-inline'; object-src 'none';",
              },
            ]
          : [],
      },
    ];
  },
}

module.exports = nextConfig;