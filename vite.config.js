import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      'react-crossword': path.resolve(__dirname, '../react-crossword/src/index.js'),
    },
  },
});
