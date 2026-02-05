import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // 本番ビルド時の最適化設定
  compiler: {
    // 本番環境ではconsole.logを削除
    removeConsole: process.env.NODE_ENV === 'production' ? {
      exclude: ['error', 'warn'], // errorとwarnは残す
    } : false,
  },
};

export default nextConfig;
