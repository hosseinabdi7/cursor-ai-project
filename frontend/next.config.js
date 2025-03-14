/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  images: {
    unoptimized: true,
  },
  basePath: '/cursor-ai-project',
  assetPrefix: '/cursor-ai-project/',
  trailingSlash: true,
}

module.exports = nextConfig 