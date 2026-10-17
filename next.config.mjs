const SENDER_PHONE = process.env.WHATSAPP_SENDER_PHONE || process.env.NEXT_PUBLIC_WHATSAPP_SENDER_PHONE || '+919289289800';

/** @type {import('next').NextConfig} */
const nextConfig = {
  env: {
    WHATSAPP_SENDER_PHONE: SENDER_PHONE,
    NEXT_PUBLIC_WHATSAPP_SENDER_PHONE: SENDER_PHONE,
  },
  reactStrictMode: true,
  experimental: {
    serverComponentsExternalPackages: ['@neondatabase/serverless'],
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'cdn.shopify.com',
      },
      {
        protocol: 'https',
        hostname: 'hirafragrances.com',
      },
    ],
  },
  async rewrites() {
    return [
      {
        source: '/.well-known/appspecific/com.chrome.devtools.json',
        destination: '/api/devtools',
      },
    ];
  },
};

export default nextConfig;
