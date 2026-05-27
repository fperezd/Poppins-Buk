import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // POP-C0-08: Security headers obligatorios.
  // Defense in depth — los browsers refuerzan políticas por encima de la app.
  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          // Strict Transport Security — HTTPS only por 2 años, incluye subdominios
          { key: "Strict-Transport-Security", value: "max-age=63072000; includeSubDomains; preload" },
          // Prevenir clickjacking
          { key: "X-Frame-Options", value: "DENY" },
          // Prevenir MIME sniffing
          { key: "X-Content-Type-Options", value: "nosniff" },
          // Referrer policy: enviar origen pero no path en cross-origin
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          // Permissions policy — bloquear features sensibles por default
          { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=(), interest-cohort=()" },
          // CSP — restrictivo pero permite assets de Supabase, Vercel y Google Fonts.
          // En C1 endurecer agregando nonces para inline scripts si los hay.
          {
            key: "Content-Security-Policy",
            value: [
              "default-src 'self'",
              "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://*.vercel-insights.com https://*.posthog.com",
              "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
              "font-src 'self' https://fonts.gstatic.com data:",
              "img-src 'self' data: https: blob:",
              "connect-src 'self' https://*.supabase.co wss://*.supabase.co https://app.buk.cl https://*.poppins.cl https://*.vercel-insights.com https://*.posthog.com https://*.sentry.io",
              "frame-ancestors 'none'",
              "base-uri 'self'",
              "form-action 'self'",
            ].join("; "),
          },
        ],
      },
    ];
  },
};

export default nextConfig;

