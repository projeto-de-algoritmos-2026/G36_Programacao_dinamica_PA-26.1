import React, { useState } from "react";

export default function PainelOrcamento({ orcamento, onSalvar }) {
  const [editando, setEditando] = useState(false);
  const [valor,    setValor]    = useState(orcamento);

  const handleSalvar = () => {
    if (!valor || Number(valor) <= 0) return;
    onSalvar(Number(valor));
    setEditando(false);
  };

  return (
    <div className="orcamento-panel">
      <div className="orcamento-label">💰 Orçamento fixo da loja</div>
      {editando ? (
        <div className="orcamento-edit">
          <span className="orcamento-prefix">R$</span>
          <input
            type="number" min="1" max="1000"
            value={valor}
            onChange={e => setValor(e.target.value)}
            autoFocus
            onKeyDown={e => { if (e.key === "Enter") handleSalvar(); if (e.key === "Escape") setEditando(false); }}
          />
          <button className="btn-sm btn-ok" onClick={handleSalvar}>Salvar</button>
          <button className="btn-sm btn-cancel" onClick={() => setEditando(false)}>Cancelar</button>
        </div>
      ) : (
        <div className="orcamento-display">
          <span className="orcamento-valor">R$ {orcamento}</span>
          <button className="btn-sm btn-edit" onClick={() => { setValor(orcamento); setEditando(true); }}>
            ✏ Alterar
          </button>
        </div>
      )}
      <div className="orcamento-hint">O algoritmo Knapsack otimiza automaticamente ao salvar</div>
    </div>
  );
}
