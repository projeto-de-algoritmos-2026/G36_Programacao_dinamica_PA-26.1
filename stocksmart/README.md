# StockSmart — Planejador de Estoque Sazonal

Projeto fullstack com **Knapsack iterativo**, **Knapsack recursivo com memoização** e **Coin Change (Selos)**.

## Estrutura

```
stocksmart/
├── backend/
│   ├── package.json
│   └── src/
│       ├── server.js
│       ├── data/db.js                         # 15 produtos fictícios
│       ├── controllers/
│       │   ├── algoritmosController.js         # Knapsack iterativo, recursivo, Coin Change
│       │   └── stockController.js
│       └── routes/api.js
└── frontend/
    ├── package.json
    └── src/
        ├── App.js / App.css
        ├── index.js
        ├── services/api.js
        ├── hooks/useStock.js
        ├── components/
        │   ├── TabelaProdutos.jsx
        │   └── ResultadoAlgoritmos.jsx
        └── pages/Dashboard.jsx
```

## Algoritmos

### Knapsack Iterativo — bottom-up O(n×W)
Constrói a tabela `dp[n+1][W+1]` de baixo pra cima.
`dp[i][w]` = maior valor usando os primeiros `i` produtos com orçamento `w`.

### Knapsack Recursivo — top-down com memoização O(n×W)
Resolve `solve(i, w)` recursivamente, armazenando subproblemas em um Map.
Retorna número de chamadas e tamanho do cache para comparação.

### Coin Change (Selos) — O(n×W)
`dp[v]` = menor número de cédulas para formar o valor `v`.
Denominações disponíveis: R$1, R$2, R$5, R$10, R$20, R$50, R$100.

## Endpoints

| Método | Rota | Descrição |
|--------|------|-----------|
| GET | /api/produtos | Lista todos os produtos |
| POST | /api/otimizar | Roda Knapsack + Coin Change com o orçamento |

## Como rodar

```bash
cd backend && npm install && npm run dev
cd frontend && npm install && npm start
```

Acesse `http://localhost:3000`
