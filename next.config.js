/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "firebasestorage.googleapis.com",
        pathname: '**/agave-communications.appspot.com/**'
      }
    ]
  }
}

module.exports = nextConfig;
