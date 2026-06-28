import React, { useState } from "react";

export default function ResultadoAlgoritmos({ resultado }) {
  const [aba, setAba] = useState("iterativo");
  const [mostrarTabela, setMostrarTabela] = useState(false);
  if (!resultado) return null;

  const { iterativo, recursivo, troco, orcamento, capacidade } = resultado;
  const dados = aba === "iterativo" ? iterativo : recursivo;

  const melhorTempo = parseFloat(iterativo.tempoMs) <= parseFloat(recursivo.tempoMs)
    ? "iterativo" : "recursivo";

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>

      {/* Cards de comparação */}
      <div className="algo-compare">
        <div className={`algo-card-cmp ${aba === "iterativo" ? "active" : ""}`} onClick={() => setAba("iterativo")}>
          <div className="algo-tipo">Knapsack Iterativo</div>
          <div className="algo-sub">Tabela DP bottom-up · O(n×W×C)</div>
          <div className="algo-val">R$ {iterativo.valorMaximo} valor máximo</div>
          <div className="algo-meta">Gasto: R$ {iterativo.gastoTotal} / R$ {orcamento} · Peso: {iterativo.pesoTotal} / {capacidade} kg</div>
          <div className="algo-tempo" style={{ marginTop: 8, fontSize: 12, fontFamily: "'DM Mono',monospace" }}>
            ⏱ {iterativo.tempoMs} ms
            {melhorTempo === "iterativo" && <span className="badge b-ok" style={{ marginLeft: 8 }}>mais rápido</span>}
          </div>
        </div>
        <div className="algo-vs">VS</div>
        <div className={`algo-card-cmp ${aba === "recursivo" ? "active" : ""}`} onClick={() => setAba("recursivo")}>
          <div className="algo-tipo">Knapsack Recursivo</div>
          <div className="algo-sub">Memoização top-down · O(n×W×C)</div>
          <div className="algo-val">R$ {recursivo.valorMaximo} valor máximo</div>
          <div className="algo-meta-grid" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "2px 12px", fontSize: 12, color: "var(--muted)", marginTop: 4 }}>
            <span>Chamadas totais: <strong>{recursivo.chamadas}</strong></span>
            <span>Cache hits: <strong style={{ color: "var(--ok)" }}>{recursivo.cacheHits}</strong></span>
            <span>Cache misses: <strong style={{ color: "var(--warn)" }}>{recursivo.cacheMisses}</strong></span>
            <span>Entradas no cache: <strong>{recursivo.cacheSize}</strong></span>
          </div>
          <div className="algo-tempo" style={{ marginTop: 8, fontSize: 12, fontFamily: "'DM Mono',monospace" }}>
            ⏱ {recursivo.tempoMs} ms
            {melhorTempo === "recursivo" && <span className="badge b-ok" style={{ marginLeft: 8 }}>mais rápido</span>}
          </div>
        </div>
      </div>

      {/* Produtos selecionados */}
      <div className="card">
        <div className="card-title">
          🛒 Produtos selecionados — {aba === "iterativo" ? "Iterativo" : "Recursivo"}
          <span className="cnt">{dados.selecionados.length}</span>
        </div>
        <div className="sel-grid">
          {dados.selecionados.map(p => (
            <div key={p.id} className="sel-card">
              <div className="sel-nome">{p.nome}</div>
              <div className="sel-info">
                <span>Preço: <strong>R$ {p.preco}</strong></span>
                <span>Valor: <strong>R$ {p.valor}</strong></span>
              </div>
              <div className="sel-cat">{p.categoria}</div>
            </div>
          ))}
        </div>
        <div className="sel-total">
          <span>Gasto total: <strong>R$ {dados.gastoTotal}</strong></span>
          <span>Peso total: <strong>{dados.pesoTotal} kg</strong></span>
          <span>Valor total: <strong style={{color:"var(--ok)"}}>R$ {dados.valorMaximo}</strong></span>
          <span>Orçamento restante: <strong>R$ {orcamento - dados.gastoTotal}</strong></span>
          <span>Peso restante: <strong>{capacidade - dados.pesoTotal} kg</strong></span>
        </div>
      </div>

      {/* Tabela DP */}
      <div className="card">
        <div className="card-title" style={{ justifyContent: "space-between" }}>
          <span>📊 Tabela DP (última coluna) — valor máximo com orçamento R$ {orcamento}</span>
          <button className="btn-sm btn-edit" onClick={() => setMostrarTabela(v => !v)}>
            {mostrarTabela ? "Ocultar" : "Mostrar"}
          </button>
        </div>
        <div className="hint-algo">
          dp[i][W][C] = melhor valor com i produtos, orçamento W={orcamento} e capacidade C={capacidade} kg
        </div>
        {mostrarTabela && (
          <div className="table-wrap">
            <table className="tabela">
              <thead>
                <tr>
                  <th>i</th>
                  <th>Produto adicionado</th>
                  <th>dp[i][{orcamento}][{capacidade}]</th>
                  <th>Ganho</th>
                </tr>
              </thead>
              <tbody>
                {iterativo.tabelaDP.map((row, i) => {
                  const anterior = i > 0 ? iterativo.tabelaDP[i - 1].valorMaximo : 0;
                  const ganho = row.valorMaximo - anterior;
                  return (
                    <tr key={i} style={{ background: ganho > 0 ? "var(--ok-bg)" : undefined }}>
                      <td className="td-mono">{i}</td>
                      <td>{row.produto}</td>
                      <td className="td-mono"><strong>R$ {row.valorMaximo}</strong></td>
                      <td className="td-mono" style={{ color: ganho > 0 ? "var(--ok)" : "var(--muted)" }}>
                        {ganho > 0 ? `+${ganho}` : "—"}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Coin Change */}
      <div className="card">
        <div className="card-title">💵 Selos (Coin Change) — Como pagar R$ {troco.total}</div>
        <div className="hint-algo">
          Algoritmo de Selos encontra o menor número de cédulas para pagar exatamente R$ {troco.total} — O(n×W)
        </div>
        {troco.possivel ? (
          <div>
            <div className="cedulas-row">
              {troco.cedulas.map(c => (
                <div key={c.denominacao} className="cedula">
                  <div className="cedula-val">R$ {c.denominacao}</div>
                  <div className="cedula-qtd">×{c.quantidade}</div>
                </div>
              ))}
            </div>
            <div className="cedula-total">
              Total de cédulas: <strong>{troco.quantidadeMin}</strong>
            </div>
          </div>
        ) : (
          <p style={{fontSize:13,color:"var(--err)"}}>Não é possível formar este valor com as cédulas disponíveis.</p>
        )}
      </div>

    </div>
  );
}
