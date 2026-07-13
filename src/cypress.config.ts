import { defineConfig } from 'cypress';

export default defineConfig({
  e2e: {
    baseUrl: 'http://localhost:8100',
    supportFile: false,
    specPattern: 'cypress/e2e/**/*.cy.ts',
  },
});