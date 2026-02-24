/** @type {import('next').NextConfig} */
const basePathEnv = process.env.NEXT_PUBLIC_BASE_PATH
const repo = process.env.GITHUB_REPOSITORY?.split('/')[1]
const basePath =
  basePathEnv && basePathEnv.trim().length > 0
    ? basePathEnv.trim()
    : (process.env.GITHUB_ACTIONS === 'true' && repo ? `/${repo}` : '')

const nextConfig = {
  output: 'export',
  trailingSlash: true,
  basePath,
  assetPrefix: basePath ? `${basePath}/` : '',
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },
}

export default nextConfig
