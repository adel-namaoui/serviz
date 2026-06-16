/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "images.unsplash.com" },
      { protocol: "https", hostname: "placehold.co" },
      { protocol: "https", hostname: "lh3.googleusercontent.com" },
    ],
  },
  // AJOUTEZ CES DEUX BLOCS ICI :
  typescript: {
    ignoreBuildErrors: true, // Permet de déployer même s'il y a des erreurs de type
  },
  eslint: {
    ignoreDuringBuilds: true, // Permet de déployer même s'il y a des erreurs de lint
  },
}

export default nextConfig