
import type {NextConfig} from 'next';

const nextConfig: NextConfig = {
  /* config options here */
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'placehold.co',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'firebasestorage.googleapis.com',
        port: '',
        pathname: '/**',
      }
    ],
    // Data URLs are no longer the primary storage method for employee photos
    // but might be used for initial preview or placeholders.
    // Allow data URLs generally if needed, or remove if strictly using Storage URLs.
    // dangerouslyAllowSVG: true, 
    // contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
    // domains: ['placehold.co', 'firebasestorage.googleapis.com'], // Already covered by remotePatterns
  },
};

export default nextConfig;
