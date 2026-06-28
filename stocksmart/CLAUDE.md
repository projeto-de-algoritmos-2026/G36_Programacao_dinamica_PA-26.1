# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

**Backend** (Express, port 3001):
```bash
cd backend && npm install
npm run dev      # nodemon watch mode
npm start        # production
```

**Frontend** (React CRA, port 3000):
```bash
cd frontend && npm install
npm start        # dev server with proxy → localhost:3001
npm run build    # production build
```

There are no test suites configured in either package.

## Architecture

This is a fullstack monorepo with two independent `package.json` roots — `backend/` and `frontend/` — that must be started separately.

**Data layer** — `backend/src/data/db.js` holds all state in-memory (no database). Products array and the fixed budget (`orcamentoFixo`) live here and reset on every server restart. The file also exports the coin denominations array used by Coin Change.

**Algorithm layer** — `backend/src/controllers/algoritmosController.js` implements the three dynamic programming algorithms as pure functions with no side effects:
- `knapsackIterativo` — bottom-up DP table, returns `tabelaDP` (last column only), selected products, and total spend.
- `knapsackRecursivo` — top-down with a `Map` memo, returns call count and cache size for comparison with the iterative version.
- `coinChange` — classic unbounded coin change on fixed denominations `[1,2,5,10,20,50,100]`, called with the *spend* from the iterative knapsack result.

**Request flow** — `GET /api/otimizar` calls all three algorithms sequentially inside `stockController._rodar()` and returns a single JSON object `{ orcamento, iterativo, recursivo, troco }`. Budget is read from the in-memory store; there is no body parameter.

**Frontend state** — `useStock.js` is the single source of truth for all UI state. It auto-triggers re-optimization whenever `produtos` or `orcamento` change (via `useEffect`). All API calls go through `services/api.js` (axios instance with `baseURL: "/api"`); the CRA proxy in `frontend/package.json` forwards `/api/*` to `localhost:3001`.

**Budget constraint** — the backend caps orçamento at R$1000 (`PUT /api/orcamento`). Products have `preco`, `peso`, and `valor` fields; only `preco` and `valor` are used by the knapsack (peso is stored but not constrained).
