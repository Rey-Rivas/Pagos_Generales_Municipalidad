
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import dotenv from 'dotenv'
import path from 'path'

// Load .env file
dotenv.config({ path: path.resolve(__dirname, '../backend/src/config/.env') })

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue()],
  server: {
    port: Number(process.env.FRONTPORT), // Use the port variable
    proxy: {
      '/api': `http://${process.env.HOST}:${process.env.PORT}`
    }
  }
})
