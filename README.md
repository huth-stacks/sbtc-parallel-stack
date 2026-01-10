# sBTC Parallel Stack

A monorepo containing the sBTC Bridge application and supporting documentation.

## Structure

```
sbtc-parallel-stack/
├── apps/
│   └── bridge/          # sBTC Bridge Next.js application
└── docs/                # Documentation preview site (Docsify)
```

## Apps

### Bridge (`apps/bridge`)

The sBTC Bridge web application for depositing BTC to mint sBTC and withdrawing sBTC back to BTC.

```bash
cd apps/bridge
npm install
npm run dev
```

**Environment:** Requires `.env` file with Bitcoin/Stacks node URLs. See `.env.sample`.

### Docs (`docs`)

Documentation preview site for sBTC Bridge guides.

```bash
cd docs
npx serve .
```

**Live Preview:** https://sbtc-parallel-stack-docs.up.railway.app

## Deployment

Both apps deploy automatically via Railway GitHub integration:

- **Bridge:** Deploys from `apps/bridge` on push to `main`
- **Docs:** Deploys from `docs` on push to `main`

## Development

This is a monorepo managed without workspace tools (no Turborepo/Nx). Each app is independent:

- Apps don't share dependencies
- Each app has its own `package.json`
- Deploy and develop independently
