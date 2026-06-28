import React, { useState } from "react";

const VAZIO = { nome: "", categoria: "", preco: "", peso: "", valor: "" };

export default function FormProduto({ categorias, onCadastrar }) {
  const [form,    setForm]    = useState(VAZIO);
  const [erro,    setErro]    = useState("");
  const [loading, setLoading] = useState(false);

  const set = k => e => setForm(f => ({ ...f, [k]: e.target.value }));

  const handleSubmit = async e => {
    e.preventDefault();
    setErro("");
    const { nome, categoria, preco, peso, valor } = form;
    if (!nome || !categoria || !preco || !peso || !valor)
      return setErro("Preencha todos os campos.");
    if (Number(preco) <= 0 || Number(valor) <= 0 || Number(peso) <= 0)
      return setErro("Preço, valor e peso devem ser maiores que zero.");
    setLoading(true);
    try {
      await onCadastrar({ nome, categoria, preco: Number(preco), peso: Number(peso), valor: Number(valor) });
      setForm(VAZIO);
    } catch { setErro("Erro ao cadastrar."); }
    finally { setLoading(false); }
  };

  return (
    <div className="card">
      <div className="card-title">➕ Cadastrar novo produto</div>
      {erro && <div className="alert a-err">{erro}</div>}
      <form onSubmit={handleSubmit} className="form-grid">
        <div className="fg full">
          <label>Nome do produto</label>
          <input type="text" value={form.nome} onChange={set("nome")} placeholder="Ex: Azeite 500ml" />
        </div>
        <div className="fg">
          <label>Categoria</label>
          <select value={form.categoria} onChange={set("categoria")}>
            <option value="">Selecione...</option>
            {categorias.map(c => <option key={c} value={c}>{c}</option>)}
          </select>
        </div>
        <div className="fg">
          <label>Peso (kg)</label>
          <input type="number" min="0.1" step="0.1" value={form.peso} onChange={set("peso")} placeholder="Ex: 2" />
        </div>
        <div className="fg">
          <label>Preço de compra (R$)</label>
          <input type="number" min="1" value={form.preco} onChange={set("preco")} placeholder="Ex: 30" />
        </div>
        <div className="fg">
          <label>Valor estimado (R$)</label>
          <input type="number" min="1" value={form.valor} onChange={set("valor")} placeholder="Ex: 45" />
        </div>
        <div className="fg full">
          <button type="submit" className="btn-primary" disabled={loading}>
            {loading ? "Cadastrando..." : "Cadastrar produto"}
          </button>
        </div>
      </form>
    </div>
  );
}
