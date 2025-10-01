import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'node:path';

// Added alias support so imports like "components/XYZ" resolve properly.
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      components: path.resolve(__dirname, 'src/components'),
      pages: path.resolve(__dirname, 'src/pages'),
      services: path.resolve(__dirname, 'src/services'),
      lib: path.resolve(__dirname, 'src/lib'),
      types: path.resolve(__dirname, 'src/types')
    }
  },
  build: {
    outDir: 'dist'
  }
});
