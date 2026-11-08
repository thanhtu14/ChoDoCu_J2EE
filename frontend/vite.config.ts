import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";

// Dev server chạy ở http://localhost:5173 và chuyển tiếp /api, /uploads sang Spring Boot.
// Cùng origin trong trình duyệt giúp tránh cấu hình CORS riêng cho môi trường phát triển.
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "");
  const target = env.VITE_PROXY_TARGET || "http://localhost:8080";

  return {
    plugins: [react()],
    server: {
      port: 5173,
      proxy: {
        "/api": { target, changeOrigin: true, secure: false },
        "/uploads": { target, changeOrigin: true, secure: false },
      },
    },
  };
});
