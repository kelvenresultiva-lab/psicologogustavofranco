import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      // Vercel Blob (produção) — o subdomínio muda conforme o store, então
      // liberamos qualquer *.public.blob.vercel-storage.com.
      {
        protocol: "https",
        hostname: "*.public.blob.vercel-storage.com",
      },
    ],
  },
};

export default nextConfig;
