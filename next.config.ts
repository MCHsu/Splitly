import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  // images: {
  //   remotePatterns: [
  //     {
  //       protocol: "https",
  //       hostname: "api.dicebear.com",
  //       pathname: "/**",
  //     },
  //   ],
  // },
  reactCompiler: true,
  serverExternalPackages: ["@prisma/client"],
};

export default nextConfig;
