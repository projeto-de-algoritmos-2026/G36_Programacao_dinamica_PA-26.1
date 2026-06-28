import React, { useState } from "react";

export default function ResultadoAlgoritmos({ resultado }) {
  const [aba, setAba] = useState("iterativo");
  if (!resultado) return null;

  const { iterativo, recursivo, troco, orcamento } = resultado;
  const dados = aba === "iterativo" ? iterativo : recursivo;

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>

      {/* Cards de comparação */}
      <div className="algo-compare">
        <div className={`algo-card-cmp ${aba === "iterativo" ? "active" : ""}`} onClick={() => setAba("iterativo")}>
          <div className="algo-tipo">Knapsack Iterativo</div>
          <div className="algo-sub">Tabela DP bottom-up · O(n×W)</div>
          <div className="algo-val">R$ {iterativo.valorMaximo} valor máximo</div>
          <div className="algo-meta">Gasto: R$ {iterativo.gastoTotal} / R$ {orcamento}</div>
        </div>
        <div className="algo-vs">VS</div>
        <div className={`algo-card-cmp ${aba === "recursivo" ? "active" : ""}`} onClick={() => setAba("recursivo")}>
          <div className="algo-tipo">Knapsack Recursivo</div>
          <div className="algo-sub">Memoização top-down · O(n×W)</div>
          <div className="algo-val">R$ {recursivo.valorMaximo} valor máximo</div>
          <div className="algo-meta">{recursivo.chamadas} chamadas · {recursivo.cacheSize} no cache</div>
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
          <span>Valor total obtido: <strong style={{color:"var(--ok)"}}>R$ {dados.valorMaximo}</strong></span>
          <span>Orçamento restante: <strong>R$ {orcamento - dados.gastoTotal}</strong></span>
        </div>
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
