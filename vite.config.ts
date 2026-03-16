import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['favicon.svg', 'icons/*.svg'],
      manifest: {
        name: 'Yomiyasu - 日本語文章チェック',
        short_name: 'Yomiyasu',
        description: '日本語の文章を貼り付けるだけで読みやすさを自動チェック',
        theme_color: '#7c3aed',
        background_color: '#f8fafc',
        display: 'standalone',
        orientation: 'portrait',
        lang: 'ja',
        icons: [
          {
            src: 'icons/icon-192.svg',
            sizes: '192x192',
            type: 'image/svg+xml',
          },
          {
            src: 'icons/icon-512.svg',
            sizes: '512x512',
            type: 'image/svg+xml',
            purpose: 'any maskable',
          },
        ],
      },
      workbox: {
        globPatterns: ['**/*.{js,css,html,svg,png}'],
      },
    }),
  ],
})
