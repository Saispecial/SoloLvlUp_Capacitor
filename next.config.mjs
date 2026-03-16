/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },
  // We use static 'export' for the Android mobile app, but disable it on Vercel so the API routes build!
  output: process.env.VERCEL === "1" ? undefined : 'export',
  basePath: '', // Capacitor serves from root
  trailingSlash: false, // Help standard Next.js routing
}

export default nextConfig
