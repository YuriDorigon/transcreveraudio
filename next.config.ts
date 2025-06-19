
import type {NextConfig} from 'next';

// Basic Content Security Policy
const ContentSecurityPolicy = `
  default-src 'self';
  script-src 'self' 'unsafe-eval' 'unsafe-inline' https://va.vercel-scripts.com https://www.googletagmanager.com; 
  img-src 'self' data: https://placehold.co https://firebasestorage.googleapis.com;
  font-src 'self' https://fonts.gstatic.com;
  connect-src 'self' https://firestore.googleapis.com wss: https://firebase.googleapis.com https://firebaseinstallations.googleapis.com;
  frame-src 'self' https://www.google.com; 
  object-src 'none';
  base-uri 'self';
  form-action 'self';
  frame-ancestors 'none';
  upgrade-insecure-requests;
`;


const baseConfig: NextConfig = {
  /* config options here */
  typescript: {
    // Consider removing this for stricter builds if possible
    ignoreBuildErrors: true,
  },
  eslint: {
    // Consider removing this for stricter builds if possible
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
  },
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'Content-Security-Policy',
            value: ContentSecurityPolicy.replace(/\n/g, '').trim(),
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'X-Frame-Options',
            value: 'DENY', // Or 'SAMEORIGIN' if you need to embed it in an iframe from the same origin
          },
          {
            key: 'X-XSS-Protection',
            value: '1; mode=block',
          },
          {
            key: 'Referrer-Policy',
            value: 'strict-origin-when-cross-origin',
          },
          {
             key: 'Permissions-Policy',
             value: 'camera=(), microphone=(), geolocation=(), payment=()', // Adjust as needed
          },
          // {
          //   key: 'Strict-Transport-Security',
          //   value: 'max-age=63072000; includeSubDomains; preload', // HSTS - be cautious with preload
          // },
        ],
      },
    ];
  },
};

let finalConfig = baseConfig;

if (process.env.ANALYZE === 'true') {
  const withBundleAnalyzer = require('@next/bundle-analyzer')({
    enabled: true,
  });
  finalConfig = withBundleAnalyzer(baseConfig);
}

export default finalConfig;
