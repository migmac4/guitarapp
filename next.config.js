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
  // Configuração de headers de segurança
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          {
            key: 'Cross-Origin-Opener-Policy',
            value: 'same-origin-allow-popups'
          }
        ]
      }
    ]
  }
}

module.exports = nextConfig
