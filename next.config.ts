import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
};

module.exports = {
  images: {
    remotePatterns: [new URL('https://jfcpolska.pl/**')],
    qualities: [25, 30, 50, 75]
  },
}

export default nextConfig;
