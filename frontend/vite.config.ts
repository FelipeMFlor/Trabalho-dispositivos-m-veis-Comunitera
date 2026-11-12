import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    // "proxy": todo pedido que começa com /api é repassado para o servidor (backend).
    // Assim o app chama só "/api/eventos" e não precisa saber o endereço do servidor.
    proxy: {
      '/api': 'http://localhost:3000',
    },
  },
})
