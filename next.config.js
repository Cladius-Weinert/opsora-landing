/** @type {import('next').NextConfig} */
const isGithubPages = process.env.GITHUB_PAGES === 'true';
const isStaticExport = process.env.STATIC_EXPORT === 'true' || isGithubPages;

const nextConfig = {
  reactStrictMode: true,
  // Static export only for GitHub Pages — Vercel needs SSR/API routes
  ...(isStaticExport ? { output: 'export' } : {}),
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: 'avatars.githubusercontent.com' },
      { protocol: 'https', hostname: 'lh3.googleusercontent.com' },
      { protocol: 'https', hostname: '**.vercel.app' },
    ],
    unoptimized: isStaticExport,
  },
  env: {
    NEXT_PUBLIC_API_URL:
      process.env.NEXT_PUBLIC_API_URL || 'https://mwbgkkthwwlcndccnbnf.supabase.co/functions/v1/opsora-api',
  },
  async headers() {
    // headers() is ignored when output: 'export' — harmless for GH Pages
    return [
      {
        source: '/:path*',
        headers: [
          { key: 'X-Frame-Options', value: 'DENY' },
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          { key: 'X-XSS-Protection', value: '1; mode=block' },
          { key: 'Referrer-Policy', value: 'origin-when-cross-origin' },
          { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=()' },
        ],
      },
      {
        source: '/api/:path*',
        headers: [
          { key: 'Access-Control-Allow-Origin', value: '*' },
          { key: 'Access-Control-Allow-Methods', value: 'GET, POST, PUT, DELETE, OPTIONS' },
          {
            key: 'Access-Control-Allow-Headers',
            value: 'Content-Type, Authorization, X-Requested-With',
          },
          { key: 'Access-Control-Max-Age', value: '86400' },
        ],
      },
    ];
  },
  async rewrites() {
    if (isStaticExport) return [];
    return [{ source: '/health', destination: '/api/health' }];
  },
};

module.exports = nextConfig;
