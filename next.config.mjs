/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
      remotePatterns: [
        {
          protocol: "https",
          hostname: "www.plasticaucho.com.pe",
        },
      ],
    },
  };
  
  export default nextConfig;
  