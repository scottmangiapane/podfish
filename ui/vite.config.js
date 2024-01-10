import { defineConfig, loadEnv } from 'vite';

import react from '@vitejs/plugin-react-swc';

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');

  return {
    plugins: [react()],
    server: {
      host: '0.0.0.0',
      port: 3000,
      proxy: {
        '/api': {
          changeOrigin: true,
          secure: false,
          target: env.UI_PROXY_PASS,
        }
      },
    }
  };
});
