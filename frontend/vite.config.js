import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: [
      { find: 'fs', replacement: './empty.js' },
      { find: 'path', replacement: './empty.js' },
      { find: 'os', replacement: './empty.js' },
    ],
  },
})
