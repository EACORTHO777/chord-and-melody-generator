import { defineConfig, minimal2023Preset } from '@vite-pwa/assets-generator/config'

export default defineConfig({
  preset: {
    ...minimal2023Preset,
    transparent: { ...minimal2023Preset.transparent, padding: 0 },
    maskable: { ...minimal2023Preset.maskable, resizeOptions: { background: '#e5e5e5' } },
    apple: { ...minimal2023Preset.apple, resizeOptions: { background: '#e5e5e5' } },
  },
  images: ['public/logo.svg'],
})
