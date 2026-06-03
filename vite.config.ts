import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import path from 'path'

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
  ],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      '@react-native-async-storage/async-storage': path.resolve(__dirname, './src/lib/asyncStorage.ts'),
      'react-native': 'react-native-web',
    },
  },
  base: '/ebalistyka-web/',
})
