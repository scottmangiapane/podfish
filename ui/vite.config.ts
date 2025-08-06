import autoprefixer from 'autoprefixer';
import path from 'path';
import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react-swc';

export default defineConfig(({ mode }: { mode: string }) => {
  const env = loadEnv(mode, process.cwd(), '');

  return {
    css: {
      postcss: {
        plugins: [
            autoprefixer
        ],
      }
    },
    plugins: [react()],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, './src'),
      }
    },
    server: {
      host: '0.0.0.0',
      port: Number(env.UI_PORT),
      proxy: {
        '^/(api|file|swagger)/.*': {
          changeOrigin: true,
          target: `${env.API_URL}:${env.API_PORT}`,
        }
      },
    }
  };
});
