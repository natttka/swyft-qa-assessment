
import { defineConfig } from 'cypress'
export default defineConfig({
  e2e: {
    baseUrl: 'http://localhost:5174',
    video: false,
    retries: 1,
    setupNodeEvents(on, config) {},
  }
})
