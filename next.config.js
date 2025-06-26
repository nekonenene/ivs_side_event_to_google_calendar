/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    // ビルド時にESLintエラーを無視
    ignoreDuringBuilds: true,
  },
}

module.exports = nextConfig
