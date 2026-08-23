import path from "node:path";
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // 明確指定 workspace root，避免 Turbopack 往上層目錄推斷到
  // C:\Users\user 的 package-lock.json
  turbopack: {
    root: path.join(__dirname),
  },
};

export default nextConfig;
