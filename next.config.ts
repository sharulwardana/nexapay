/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    qualities: [30, 75, 90, 95],
    remotePatterns: [
      { protocol: 'https', hostname: '**.nexapay.id' },
      { protocol: 'https', hostname: 'lh3.googleusercontent.com' },
      { protocol: 'https', hostname: 'cdn.discordapp.com' },
    ],
  },
  experimental: {
    optimizeCss: false,
    useTypeScriptCli: true,
  },
  serverExternalPackages: ['@prisma/adapter-pg', 'pg'],

  // ─── Security Headers ───────────────────────────────────────────
  // Addresses: CSRF protection, clickjacking, MIME sniffing, HSTS, CSP
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          // Prevent clickjacking — allow SAMEORIGIN for testing tools
          { key: 'X-Frame-Options', value: 'SAMEORIGIN' },
          // Prevent MIME-type sniffing
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          // XSS protection (legacy browsers)
          { key: 'X-XSS-Protection', value: '1; mode=block' },
          // Referrer policy — send origin only on cross-origin requests
          { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
          // Restrict browser feature/permission access
          {
            key: 'Permissions-Policy',
            value: 'camera=(), microphone=(), geolocation=(), interest-cohort=()',
          },
          // Content Security Policy
          {
            key: 'Content-Security-Policy',
            value: [
              "default-src 'self'",
              process.env.NODE_ENV === 'development'
                ? "script-src 'self' 'unsafe-eval' 'unsafe-inline'"
                : "script-src 'self' 'unsafe-inline'",
              "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
              "font-src 'self' https://fonts.gstatic.com data:",
              "img-src 'self' data: blob: https: http:",
              "connect-src 'self' https://generativelanguage.googleapis.com https://*.google.com https://*.supabase.co wss://*.supabase.co",
              "worker-src 'self' blob:",
              "frame-ancestors 'self'",
              "base-uri 'self'",
              "form-action 'self'",
            ].join('; '),
          },
          // HSTS — enforce HTTPS (only effective in production with HTTPS)
          {
            key: 'Strict-Transport-Security',
            value: 'max-age=31536000; includeSubDomains',
          },
        ],
      },
    ];
  },
};

export default nextConfig;
