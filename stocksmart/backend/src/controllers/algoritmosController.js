const { performance } = require("perf_hooks");

// ─────────────────────────────────────────
// KNAPSACK ITERATIVO 2D — Programação Dinâmica
// Complexidade: O(n × W × C)
// dp[i][w][c] = maior valor usando os primeiros i produtos
//               com orçamento w e capacidade de peso c
// ─────────────────────────────────────────
function knapsackIterativo(produtos, orcamento, capacidade) {
  const inicio = performance.now();
  const n = produtos.length;
  const W = orcamento;
  const C = Math.round(capacidade); // índice inteiro

  const dp = Array.from({ length: n + 1 }, () =>
    Array.from({ length: W + 1 }, () => new Array(C + 1).fill(0))
  );

  for (let i = 1; i <= n; i++) {
    const { preco, valor } = produtos[i - 1];
    const peso = Math.round(produtos[i - 1].peso);
    for (let w = 0; w <= W; w++) {
      for (let c = 0; c <= C; c++) {
        dp[i][w][c] = dp[i - 1][w][c];
        if (preco <= w && peso <= c) {
          dp[i][w][c] = Math.max(dp[i][w][c], dp[i - 1][w - preco][c - peso] + valor);
        }
      }
    }
  }

  // Rastreia selecionados
  const selecionados = [];
  let w = W, c = C;
  for (let i = n; i > 0; i--) {
    if (dp[i][w][c] !== dp[i - 1][w][c]) {
      selecionados.push(produtos[i - 1]);
      w -= produtos[i - 1].preco;
      c -= Math.round(produtos[i - 1].peso);
    }
  }

  // Última "célula" por linha: dp[i][W][C]
  const tabelaDP = dp.map((layer, i) => ({
    produto:     i === 0 ? "—" : produtos[i - 1].nome,
    valorMaximo: layer[W][C],
  }));

  return {
    valorMaximo: dp[n][W][C],
    gastoTotal:  selecionados.reduce((a, p) => a + p.preco, 0),
    pesoTotal:   selecionados.reduce((a, p) => a + Math.round(p.peso), 0),
    selecionados,
    tabelaDP,
    tempoMs:     (performance.now() - inicio).toFixed(4),
  };
}

// ─────────────────────────────────────────
// KNAPSACK RECURSIVO 2D com memoização
// Complexidade: O(n × W × C) com cache
// ─────────────────────────────────────────
function knapsackRecursivo(produtos, orcamento, capacidade) {
  const inicio  = performance.now();
  const n       = produtos.length;
  const C       = Math.round(capacidade);
  const memo    = new Map();
  let chamadas  = 0;
  let cacheHits = 0;

  function solve(i, w, c) {
    chamadas++;
    if (i === 0 || w === 0 || c === 0) return 0;

    const key = `${i},${w},${c}`;
    if (memo.has(key)) { cacheHits++; return memo.get(key); }

    const { preco, valor } = produtos[i - 1];
    const peso = Math.round(produtos[i - 1].peso);

    const resultado = (preco > w || peso > c)
      ? solve(i - 1, w, c)
      : Math.max(solve(i - 1, w, c), solve(i - 1, w - preco, c - peso) + valor);

    memo.set(key, resultado);
    return resultado;
  }

  const valorMaximo = solve(n, orcamento, C);

  // Rastreia selecionados (memo já preenchido)
  const selecionados = [];
  let w = orcamento, c = C;
  for (let i = n; i > 0; i--) {
    const { preco, valor } = produtos[i - 1];
    const peso = Math.round(produtos[i - 1].peso);
    if (w >= preco && c >= peso && solve(i, w, c) === solve(i - 1, w - preco, c - peso) + valor) {
      selecionados.push(produtos[i - 1]);
      w -= preco;
      c -= peso;
    }
  }

  return {
    valorMaximo,
    gastoTotal:  selecionados.reduce((a, p) => a + p.preco, 0),
    pesoTotal:   selecionados.reduce((a, p) => a + Math.round(p.peso), 0),
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
// Complexidade: O(n × W)
// dp[v] = menor número de cédulas para formar o valor v
// ─────────────────────────────────────────
function coinChange(denominacoes, valor) {
  const INF = Infinity;
  const dp  = new Array(valor + 1).fill(INF);
  const de  = new Array(valor + 1).fill(-1);
  dp[0] = 0;

  for (let v = 1; v <= valor; v++) {
    for (const d of denominacoes) {
      if (d <= v && dp[v - d] + 1 < dp[v]) {
        dp[v] = dp[v - d] + 1;
        de[v] = d;
      }
    }
  }

  if (dp[valor] === INF) return { possivel: false, cedulas: [], total: 0 };

  const cedulas = [];
  let v = valor;
  while (v > 0) { cedulas.push(de[v]); v -= de[v]; }

  const agrupado = {};
  cedulas.forEach(c => agrupado[c] = (agrupado[c] || 0) + 1);

  return {
    possivel:      true,
    quantidadeMin: dp[valor],
    cedulas:       Object.entries(agrupado)
                     .sort((a, b) => b[0] - a[0])
                     .map(([den, qtd]) => ({ denominacao: Number(den), quantidade: qtd })),
    total: valor,
  };
}

module.exports = { knapsackIterativo, knapsackRecursivo, coinChange };
