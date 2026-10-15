import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "www.ubuy.com.ar" },
      { protocol: "https", hostname: "i.ebayimg.com" },
      { protocol: "https", hostname: "media.adeo.com" },
      { protocol: "https", hostname: "www.asus.com" },
      { protocol: "https", hostname: "cdn-xiaomi.waugi.com.ar" },
      { protocol: "https", hostname: "example.com" },
      { protocol: "https", hostname: "audioimport.com.ar" },
      { protocol: "https", hostname: "http2.mlstatic.com" },
      { protocol: "https", hostname: "fullh4rd.com.ar" },
      { protocol: "https", hostname: "d2eebw31vcx88p.cloudfront.net" },
    ],
  },
};

export default nextConfig;
