# Prompt — Deployment Configuration

```
Generate everything needed to deploy the NovaMart dashboard to Vercel.

1. vercel.json: configure as SPA (all routes serve index.html)
2. Update package.json scripts: build, preview, lint, test, test:e2e
3. .github/workflows/ci.yml: GitHub Actions on push to main:
     - npm ci
     - ESLint
     - Vitest unit tests
     - Build (npm run build)
     - Deploy to Vercel ($VERCEL_TOKEN secret)
     - E2e tests against the production build
4. .env.example: document any environment variables
5. README.md: setup, development, testing, and deployment instructions
```
