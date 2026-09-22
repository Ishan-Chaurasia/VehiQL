/** @type {import('next').NextConfig} */
const nextConfig = {
  /* config options here */

  experimental: {
    serverComponentsHmrCache: false, // default to true
    serverActions: {
      bodySizeLimit: "10mb",
    },
  },

  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "huiduzybioornqgbvbuj.supabase.co",
      },
    ],
  },

  reactCompiler: true,
};

export default nextConfig;
