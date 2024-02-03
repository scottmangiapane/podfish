import { defineConfig, loadEnv } from 'vite';

import react from '@vitejs/plugin-react-swc';

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');

  return {
    plugins: [react()],
    server: {
      host: '0.0.0.0',
      port: env.UI_PORT,
      proxy: {
        '^\/(api|file|swagger)\/.*': {
          changeOrigin: true,
          secure: env.SECURE_COOKIES, // TODO is this needed?
          target: env.API_URL,
        }
      },
    }
  };
});
