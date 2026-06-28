import React, { useState } from "react";

function CampoEditavel({ label, valor, prefixo, sufixo, min, max, onSalvar, hint }) {
  const [editando, setEditando] = useState(false);
  const [input,    setInput]    = useState(valor);

  const handleSalvar = () => {
    const v = Number(input);
    if (!v || v <= 0) return;
    onSalvar(v);
    setEditando(false);
  };

  return (
    <div className="restricao-item">
      <div className="orcamento-label">{label}</div>
      {editando ? (
        <div className="orcamento-edit">
          {prefixo && <span className="orcamento-prefix">{prefixo}</span>}
          <input
            type="number" min={min} max={max}
            value={input}
            onChange={e => setInput(e.target.value)}
            autoFocus
            onKeyDown={e => { if (e.key === "Enter") handleSalvar(); if (e.key === "Escape") setEditando(false); }}
          />
          {sufixo && <span className="orcamento-prefix">{sufixo}</span>}
          <button className="btn-sm btn-ok"     onClick={handleSalvar}>Salvar</button>
          <button className="btn-sm btn-cancel" onClick={() => setEditando(false)}>Cancelar</button>
        </div>
      ) : (
        <div className="orcamento-display">
          <span className="orcamento-valor">{prefixo && `${prefixo} `}{valor}{sufixo && ` ${sufixo}`}</span>
          <button className="btn-sm btn-edit" onClick={() => { setInput(valor); setEditando(true); }}>✏ Alterar</button>
        </div>
      )}
      {hint && <div className="orcamento-hint restricao-hint">{hint}</div>}
    </div>
  );
}

export default function PainelOrcamento({ orcamento, capacidade, onSalvar, onSalvarCapacidade }) {
  return (
    <div className="orcamento-panel">
      <CampoEditavel
        label="💰 Orçamento"
        valor={orcamento}
        prefixo="R$"
        min={1} max={1000}
        onSalvar={onSalvar}
        hint="máx R$ 1.000"
      />
      <div className="restricao-divider" />
      <CampoEditavel
        label="📦 Cap. de peso"
        valor={capacidade}
        sufixo="kg"
        min={1} max={50}
        onSalvar={onSalvarCapacidade}
        hint="máx 50 kg"
      />
      <div className="orcamento-hint" style={{ marginLeft: "auto", alignSelf: "center" }}>
        Knapsack 2D re-otimiza ao salvar
      </div>
    </div>
  );
}
