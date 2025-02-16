/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    // Warning: This allows production builds to successfully complete even if
    // your project has ESLint errors.
    ignoreDuringBuilds: true,
  },
  typescript: {
    // !! WARN !!
    // Dangerously allow production builds to successfully complete even if
    // your project has type errors.
    ignoreBuildErrors: true,
  },
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          {
            key: 'Content-Security-Policy',
            value: [
              "default-src 'self'",
              "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://pagead2.googlesyndication.com https://partner.googleadservices.com",
              "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
              "font-src 'self' https://fonts.gstatic.com",
              "img-src 'self' https: data:",
              "connect-src 'self' ws: wss: http://localhost:3001 https://localhost:3001",
              "frame-src https://googleads.g.doubleclick.net https://tpc.googlesyndication.com",
              "worker-src 'self' blob:",
              "manifest-src 'self'"
            ].join('; ')
          }
        ],
      },
    ]
  },
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: '/api/:path*',
      },
      {
        source: '/health',
        destination: '/api/health',
      },
      // Add explicit health check path for Railway
      {
        source: '/_health',
        destination: '/api/health',
      }
    ];
  },
  output: 'standalone',
}

module.exports = nextConfig 