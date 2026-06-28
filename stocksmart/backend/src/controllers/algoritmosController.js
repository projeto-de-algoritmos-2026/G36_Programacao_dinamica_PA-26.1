const { performance } = require("perf_hooks");

// ─────────────────────────────────────────
// KNAPSACK ITERATIVO — Programação Dinâmica
// Complexidade: O(n * W)
// Constrói a tabela dp[n+1][W+1] de baixo pra cima
// ─────────────────────────────────────────
function knapsackIterativo(produtos, orcamento) {
  const inicio = performance.now();
  const n  = produtos.length;
  const W  = orcamento;

  // dp[i][w] = maior valor usando os primeiros i produtos com orçamento w
  const dp = Array.from({ length: n + 1 }, () => new Array(W + 1).fill(0));

  for (let i = 1; i <= n; i++) {
    const { preco, valor } = produtos[i - 1];
    for (let w = 0; w <= W; w++) {
      // Não inclui o produto i
      dp[i][w] = dp[i - 1][w];
      // Inclui o produto i (se couber no orçamento)
      if (preco <= w) {
        dp[i][w] = Math.max(dp[i][w], dp[i - 1][w - preco] + valor);
      }
    }
  }

  // Rastreia quais produtos foram selecionados
  const selecionados = [];
  let w = W;
  for (let i = n; i > 0; i--) {
    if (dp[i][w] !== dp[i - 1][w]) {
      selecionados.push(produtos[i - 1]);
      w -= produtos[i - 1].preco;
    }
  }

  // Última coluna da tabela: dp[i][W] = melhor valor com os i primeiros produtos
  const tabelaDP = dp.map((row, i) => ({
    produto: i === 0 ? "—" : produtos[i - 1].nome,
    valorMaximo: row[W],
  }));

  return {
    valorMaximo:  dp[n][W],
    gastoTotal:   selecionados.reduce((a, p) => a + p.preco, 0),
    selecionados,
    tabelaDP,
    tempoMs:      (performance.now() - inicio).toFixed(4),
  };
}

// ─────────────────────────────────────────
// KNAPSACK RECURSIVO com memoização
// Complexidade: O(n * W) com cache
// ─────────────────────────────────────────
function knapsackRecursivo(produtos, orcamento) {
  const inicio  = performance.now();
  const n       = produtos.length;
  const memo    = new Map();
  let chamadas  = 0;
  let cacheHits = 0;

  function solve(i, w) {
    chamadas++;
    if (i === 0 || w === 0) return 0;

    const key = `${i},${w}`;
    if (memo.has(key)) { cacheHits++; return memo.get(key); }

    const { preco, valor } = produtos[i - 1];
    const resultado = preco > w
      ? solve(i - 1, w)
      : Math.max(solve(i - 1, w), solve(i - 1, w - preco) + valor);

    memo.set(key, resultado);
    return resultado;
  }

  const valorMaximo = solve(n, orcamento);

  // Rastreia selecionados (usa memo já preenchido — O(n))
  const selecionados = [];
  let w = orcamento;
  for (let i = n; i > 0; i--) {
    const { preco, valor } = produtos[i - 1];
    if (w >= preco && solve(i, w) === solve(i - 1, w - preco) + valor) {
      selecionados.push(produtos[i - 1]);
      w -= preco;
    }
  }

  return {
    valorMaximo,
    gastoTotal:  selecionados.reduce((a, p) => a + p.preco, 0),
    selecionados,
    chamadas,
    cacheHits,
    cacheMisses: chamadas - cacheHits,
    cacheSize:   memo.size,
    tempoMs:     (performance.now() - inicio).toFixed(4),
  };
}

// ─────────────────────────────────────────
// SELOS (COIN CHANGE) — menor nº de cédulas
// Complexidade: O(n * W)
// dp[v] = menor número de cédulas para formar o valor v
// ─────────────────────────────────────────
function coinChange(denominacoes, valor) {
  const INF = Infinity;
  const dp  = new Array(valor + 1).fill(INF);
  const de  = new Array(valor + 1).fill(-1); // para rastrear quais cédulas usou
  dp[0] = 0;

  for (let v = 1; v <= valor; v++) {
    for (const d of denominacoes) {
      if (d <= v && dp[v - d] + 1 < dp[v]) {
        dp[v]  = dp[v - d] + 1;
        de[v]  = d;
      }
    }
  }

  if (dp[valor] === INF) return { possivel: false, cedulas: [], total: 0 };

  // Rastreia quais cédulas compõem o valor
  const cedulas = [];
  let v = valor;
  while (v > 0) {
    cedulas.push(de[v]);
    v -= de[v];
  }

  // Agrupa por denominação
  const agrupado = {};
  cedulas.forEach(c => agrupado[c] = (agrupado[c] || 0) + 1);

  return {
    possivel:      true,
    quantidadeMin: dp[valor],
    cedulas:       Object.entries(agrupado)
                     .sort((a, b) => b[0] - a[0])
                     .map(([den, qtd]) => ({ denominacao: Number(den), quantidade: qtd })),
    total:         valor,
  };
}

module.exports = { knapsackIterativo, knapsackRecursivo, coinChange };
