// One id per build: open tabs compare it with /api/version to offer a
// reload after a deploy, and it versions the service worker. Passed only
// through `env`: Turbopack (next dev --turbo) rejects generateBuildId.
const BUILD_ID = process.env.BUILD_ID || Date.now().toString(36)

/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    appDir: true,
  },
  env: {
    NEXT_PUBLIC_BUILD_ID: BUILD_ID,
  },
}

module.exports = nextConfig
