import react from '@vitejs/plugin-react'
import { defineConfig, loadEnv } from 'vite'
import tailwindcss from "@tailwindcss/vite";


// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');
  const useMock = (env.VITE_USE_MOCK ?? 'true') !== 'false';
  return {
    plugins: [react(), tailwindcss()],
    server: {
      proxy: useMock ? undefined : {
        '/api/': {
          target: env.API_PROXY_TARGET || 'http://localhost:5156',
          changeOrigin: true,
        },
      },
    },
  };
})
