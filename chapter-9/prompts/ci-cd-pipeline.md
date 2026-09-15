Generate a GitHub Actions CI/CD pipeline for FormForge.

Jobs:
  test: Node 22 and Node 24 (matrix), npm ci, unit tests, component tests, build
  e2e: (push to main only) docker compose up, wait, Playwright,
       upload report on failure
  deploy: (push to main only) build + push to ghcr.io,
          SSH deploy with docker compose pull && up -d

Secrets: DEPLOY_HOST, DEPLOY_USER, DEPLOY_KEY
Use ubuntu-latest with matrix build across Node 22 and 24.
File: .github/workflows/ci-cd.yml
