/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  trailingSlash: false,
  // Configuração para servir arquivos estáticos
  async rewrites() {
    return [
      {
        source: '/locales/:path*',
        destination: '/public/locales/:path*',
      },
    ]
  },
}

module.exports = nextConfig
