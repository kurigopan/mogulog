import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        "soft-white": "#fdfcfa", // やわらかい白（温かさ重視）
        "soft-gray": "#e5e7eb", // 淡いグレー
        "soft-text": "#4b5563", // 落ち着いた文字色
        "soft-purple": "#a78bfa", // 柔らかい紫
        "soft-pink": "#f9a8d4",
        "soft-brown": "#a47551", // 柔らかブラウン（木の温かみ）
      },
      boxShadow: {
        soft: "0 4px 6px -1px rgba(0, 0, 0, 0.05), 0 2px 4px -1px rgba(0, 0, 0, 0.06)",
      },
    },
  },
  plugins: [],
};
export default config;
