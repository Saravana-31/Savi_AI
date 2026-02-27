/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },
  // Turbopack config for Next.js 16 compatibility
  turbopack: {},
  // Keep webpack config for backwards compatibility / local development
  webpack: (config, { isServer }) => {
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
        path: false,
        os: false,
        crypto: false,
        stream: false,
        net: false,
        tls: false,
        zlib: false,
        assert: false,
        http: false,
        https: false,
        encoding: false,
      }
    }
    return config
  },
}

export default nextConfig
