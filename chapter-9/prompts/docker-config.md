Generate Docker configuration for the FormForge monorepo.

Requirements:
  Dockerfile.api: multi-stage (builder + production)
    builder: npm ci, build TypeScript (NestJS 12)
    production: copy dist/ and configs/, production deps only, port 3000, USER node

  Dockerfile.web: multi-stage (builder + production)
    builder: copy the root configs/ (needed by a component test's import), npm ci,
    npm run build (React 19, Vite 8, produces dist/)
    production: nginx:alpine, SPA routing, proxy /api/* to API service

  docker-compose.yml: api (port 3000) + web (port 80)
  nginx.conf: SPA fallback + API proxy

  Use Node 24 LTS. Output all four files.
