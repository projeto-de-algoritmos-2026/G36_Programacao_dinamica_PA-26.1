# StockSmart — Planejador de Estoque Sazonal

## Grupo

| Matrícula  | Aluno                              |
| ---------- | ---------------------------------- |
| 231026616  | Davi Emanuel Ribeiro de Oliveira   |
| 231026330  | Felipe Lopes Pedroza               |

## Sobre

Aplicação web de planejamento de estoque sazonal que utiliza dois algoritmos clássicos de programação dinâmica. O **Knapsack iterativo** escolhe quais produtos comprar para maximizar o valor dentro de um orçamento fixo. O **Coin Change (Selos)** calcula como pagar o valor exato com o menor número de cédulas possível. Os dois algoritmos rodam simultaneamente e o resultado é atualizado automaticamente sempre que um produto é cadastrado, editado, removido ou o orçamento é alterado.

## ⚡ Quick Start

```bash
# Terminal 1: Backend
cd stocksmart/backend
npm install
npm run dev

# Terminal 2: Frontend
cd stocksmart/frontend
npm install
npm start
```

Acesse: **`http://localhost:3000`** 🎉

## Tecnologias Utilizadas

- **Backend:** Node.js + Express.js
- **Frontend:** React 18
- **APIs:** RESTful
- **Algoritmos:** Knapsack iterativo (bottom-up), Knapsack recursivo (memoização) e Coin Change

## Funcionalidades

- 💰 **Orçamento fixo:** Defina e altere o orçamento da loja a qualquer momento
- 🛒 **Seleção ótima:** Knapsack escolhe automaticamente os produtos de maior valor dentro do orçamento
- 🔄 **Comparação iterativo vs recursivo:** Mesma resposta, abordagens diferentes — número de chamadas e cache visíveis
- 💵 **Coin Change:** Calcula o menor número de cédulas para pagar o valor exato gasto
- ➕ **Cadastrar produto:** Nome, categoria, peso, preço e valor estimado
- ✏️ **Editar produto:** Edição inline de preço, valor e peso diretamente na tabela
- 🗑️ **Remover produto:** Remove e re-otimiza automaticamente
- 📊 **Re-otimização automática:** Qualquer alteração dispara os algoritmos sem precisar clicar

## Estrutura do Projeto

stocksmart/
├── backend/
│   ├── src/
│   │   ├── server.js                        # API Express
│   │   ├── data/
│   │   │   └── db.js                        # 15 produtos mockados + orçamento fixo
│   │   ├── controllers/
│   │   │   ├── algoritmosController.js      # Knapsack iterativo, recursivo e Coin Change
│   │   │   └── stockController.js           # CRUD de produtos e orçamento
│   │   └── routes/
│   │       └── api.js                       # Rotas REST
│   └── package.json
└── frontend/
├── src/
│   ├── App.js / App.css
│   ├── index.js
│   ├── services/
│   │   └── api.js                       # Chamadas axios ao backend
│   ├── hooks/
│   │   └── useStock.js                  # Hook com re-otimização automática
│   ├── components/
│   │   ├── PainelOrcamento.jsx          # Edição do orçamento fixo
│   │   ├── FormProduto.jsx              # Cadastro de produto
│   │   ├── TabelaProdutos.jsx           # Tabela com edição inline
│   │   └── ResultadoAlgoritmos.jsx      # Resultado Knapsack + Coin Change
│   └── pages/
│       └── Dashboard.jsx               # Página principal
└── package.json



## Pré-requisitos

- Node.js 14.0+
- npm ou yarn

## Instalação

1. Clone o repositório:
```bash
   git clone https://github.com/seu-usuario/stocksmart.git
   cd stocksmart
```

2. Instale as dependências do backend:
```bash
   cd backend
   npm install
```

3. Instale as dependências do frontend:
```bash
   cd frontend
   npm install
```

## Como Usar

### Passo 1: Iniciar o Backend (Terminal 1)
```bash
cd backend
npm run dev
```
✅ Backend rodará em: **`http://localhost:3001`**

### Passo 2: Iniciar o Frontend (Terminal 2)
```bash
cd frontend
npm start
```
✅ Frontend rodará em: **`http://localhost:3000`**

## API Endpoints

| Método | Endpoint            | Descrição                                         |
| ------ | ------------------- | ------------------------------------------------- |
| GET    | `/api/produtos`     | Lista todos os produtos e orçamento atual         |
| POST   | `/api/produtos`     | Cadastra novo produto                             |
| PUT    | `/api/produtos/:id` | Edita preço, valor e/ou peso de um produto        |
| DELETE | `/api/produtos/:id` | Remove produto                                    |
| GET    | `/api/otimizar`     | Roda Knapsack + Coin Change com orçamento fixo    |
| PUT    | `/api/orcamento`    | Atualiza o orçamento fixo `{ valor }`             |

### Exemplo de Requisição

```bash
# Cadastrar produto
curl -X POST http://localhost:3001/api/produtos \
  -H "Content-Type: application/json" \
  -d '{
    "nome": "Café 500g",
    "categoria": "Bebidas",
    "preco": 24,
    "peso": 1,
    "valor": 38
  }'

# Atualizar orçamento
curl -X PUT http://localhost:3001/api/orcamento \
  -H "Content-Type: application/json" \
  -d '{ "valor": 200 }'

# Rodar otimização
curl http://localhost:3001/api/otimizar
```

## Algoritmos

### Knapsack Iterativo — bottom-up O(n × W)

Constrói a tabela `dp[n+1][W+1]` de baixo pra cima. Cada célula `dp[i][w]` representa o maior valor possível usando os primeiros `i` produtos com orçamento `w`. Ao final, rastreia quais produtos foram selecionados percorrendo a tabela de trás pra frente.

### Knapsack Recursivo — top-down com memoização O(n × W)

Resolve `solve(i, w)` recursivamente guardando subproblemas em um Map. Produz a mesma resposta que o iterativo mas de cima pra baixo. O frontend exibe o número de chamadas e o tamanho do cache para comparação entre as duas abordagens.

### Coin Change (Selos) — O(n × W)

`dp[v]` = menor número de cédulas para formar o valor `v`. Denominações disponíveis: R$1, R$2, R$5, R$10, R$20, R$50, R$100. Após o Knapsack decidir o gasto total, o Coin Change calcula como pagar esse valor exato com o mínimo de cédulas.

---

