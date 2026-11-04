# Quickstart: Site Foundation

## Local validation

```bash
npm ci
npx ng test --watch=false
npm run build:pages
npm run verify:static
npm run preview:pages
```

Expected: tests pass, the build produces prerendered static HTML, verification reports the
[static page contract](contracts/static-page.md) as satisfied, and
`http://localhost:4300/octo-robot-kva/` hydrates with no console errors or failed requests.

## Publishing validation

1. In repository settings, set **Pages > Build and deployment > Source** to **GitHub Actions**.
2. Open a pull request to `main`; confirm the workflow checks run and no deployment job runs.
3. Merge to `main`; confirm the deployment succeeds.
4. Open `https://heba920908.github.io/octo-robot-kva/`; confirm the Spanish page, title, heading,
   and kVA icon load with no failed requests.
