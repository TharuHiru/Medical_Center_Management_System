/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  compiler: {
    removeConsole: process.env.NODE_ENV === 'production',
    styledComponents: true,
  },
  images: {
    formats: ['image/avif', 'image/webp'],
    minimumCacheTTL: 60,
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**.example.com',
      },
    ],
  },
  experimental: {
    optimizePackageImports: [
      'react-icons',
      'lodash-es',
      '@mui/material',
      // Add other heavy packages here
    ],
    optimizeServerReact: true,
  },
  // Corrected server external packages (moved from experimental)
  serverExternalPackages: ['sharp'], // For image optimization
  
  // Webpack optimizations (production-safe)
  webpack: (config, { isServer, dev }) => {
    // Only optimize chunk splitting in production
    if (!dev) {
      config.optimization.splitChunks = {
        chunks: 'all',
        maxSize: 244 * 1024, // 244KB chunks
        minSize: 20 * 1024, // 20KB minimum
        cacheGroups: {
          defaultVendors: {
            test: /[\\/]node_modules[\\/]/,
            priority: -10,
            reuseExistingChunk: true,
            name(module) {
              const packageName = module.context.match(/[\\/]node_modules[\\/](.*?)([\\/]|$)/)[1];
              return `npm.${packageName.replace('@', '')}`;
            },
          },
          common: {
            minChunks: 2,
            priority: -20,
            reuseExistingChunk: true,
            name: 'common',
          },
        },
      };
      
      config.optimization.runtimeChunk = {
        name: entrypoint => `runtime-${entrypoint.name}`,
      };
      
      config.output = {
        ...config.output,
        chunkFilename: '[name].[contenthash].js',
      };
    }

    // Safe devtool configuration
    config.devtool = dev ? 'eval-cheap-module-source-map' : false;
    
    return config;
  },
  
  // Preload headers (now compatible with all Next.js versions)
  async headers() {
    return process.env.NODE_ENV === 'production' ? [
      {
        source: '/',
        headers: [
          {
            key: 'Link',
            value: '</_next/static/chunks/pages/index.js>; rel=preload; as=script',
          },
        ],
      },
      {
        source: '/dashboard',
        headers: [
          {
            key: 'Link',
            value: '</_next/static/chunks/pages/dashboard.js>; rel=preload; as=script',
          },
        ],
      },
    ] : [];
  },
};

export default nextConfig;