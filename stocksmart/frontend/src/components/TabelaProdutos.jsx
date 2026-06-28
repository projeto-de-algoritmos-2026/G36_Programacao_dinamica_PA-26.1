import React, { useState } from "react";

export default function TabelaProdutos({ produtos, selecionados = [], onRemover, onEditar }) {
  const selIds = new Set(selecionados.map(p => p.id));
  const [editId,  setEditId]  = useState(null);
  const [editData, setEditData] = useState({});

  const iniciarEdicao = (p) => {
    setEditId(p.id);
    setEditData({ preco: p.preco, valor: p.valor, peso: p.peso });
  };

  const salvarEdicao = async (id) => {
    await onEditar(id, {
      preco: Number(editData.preco),
      valor: Number(editData.valor),
      peso:  Number(editData.peso),
    });
    setEditId(null);
  };

  return (
    <div className="card">
      <div className="card-title">📦 Produtos no estoque <span className="cnt">{produtos.length}</span></div>
      <div className="table-wrap">
        <table className="tabela">
          <thead>
            <tr>
              <th>Produto</th>
              <th>Categoria</th>
              <th>Preço (R$)</th>
              <th>Valor est. (R$)</th>
              <th>Peso (kg)</th>
              <th>Status</th>
              <th>Ações</th>
            </tr>
          </thead>
          <tbody>
            {produtos.map(p => (
              <tr key={p.id} className={selIds.has(p.id) ? "row-sel" : ""}>
                <td className="td-nome">{p.nome}</td>
                <td><span className="cat-badge">{p.categoria}</span></td>

                {editId === p.id ? (
                  <>
                    <td><input className="inp-inline" type="number" value={editData.preco} onChange={e => setEditData(d => ({ ...d, preco: e.target.value }))} /></td>
                    <td><input className="inp-inline" type="number" value={editData.valor} onChange={e => setEditData(d => ({ ...d, valor: e.target.value }))} /></td>
                    <td><input className="inp-inline" type="number" step="0.1" value={editData.peso}  onChange={e => setEditData(d => ({ ...d, peso:  e.target.value }))} /></td>
                  </>
                ) : (
                  <>
                    <td className="td-mono">R$ {p.preco}</td>
                    <td className="td-mono">R$ {p.valor}</td>
                    <td className="td-mono">{p.peso}kg</td>
                  </>
                )}

                <td>
                  {selIds.has(p.id)
                    ? <span className="badge b-ok">✓ Selecionado</span>
                    : <span className="badge b-out">Não incluído</span>}
                </td>
                <td>
                  <div style={{ display: "flex", gap: 6 }}>
                    {editId === p.id ? (
                      <>
                        <button className="btn-sm btn-ok"     onClick={() => salvarEdicao(p.id)}>Salvar</button>
                        <button className="btn-sm btn-cancel" onClick={() => setEditId(null)}>×</button>
                      </>
                    ) : (
                      <>
                        <button className="btn-sm btn-edit"   onClick={() => iniciarEdicao(p)}>✏</button>
                        <button className="btn-sm btn-danger" onClick={() => onRemover(p.id, p.nome)}>🗑</button>
                      </>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
