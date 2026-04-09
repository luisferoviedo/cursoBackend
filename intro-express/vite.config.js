const { defineConfig } = require('vite')
const react = require('@vitejs/plugin-react')
const tailwindcss = require('@tailwindcss/vite').default
const path = require('path')

module.exports = defineConfig({
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src/frontend')
    }
  },
  plugins: [react(), tailwindcss()],
  server: {
    proxy: {
      '/api': 'http://localhost:3000',
      '/status': 'http://localhost:3000'
    }
  }
})
