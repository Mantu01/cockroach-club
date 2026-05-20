import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode:true,
  images:{
    remotePatterns:[
      'res.cloudinary.com',
      'thumbs.dreamstime.com',
      'images.unsplash.com'
    ].map(hostname=>({
      protocol:'https',
      hostname
    }))
  }
};

export default nextConfig;