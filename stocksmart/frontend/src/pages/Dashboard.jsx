import React, { useState } from "react";
import { useStock } from "../hooks/useStock";
import PainelOrcamento from "../components/PainelOrcamento";
import FormProduto from "../components/FormProduto";
import TabelaProdutos from "../components/TabelaProdutos";
import ResultadoAlgoritmos from "../components/ResultadoAlgoritmos";

export default function Dashboard() {
  const { produtos, categorias, orcamento, resultado, loading, loadingOpt, erro, msg,
          salvarOrcamento, cadastrar, editar, remover } = useStock();
  const [aba, setAba] = useState("resultado");

  const selecionados = resultado?.iterativo?.selecionados || [];

  return (
    <div className="dashboard">
      <header className="app-header">
        <div className="header-brand">
          <span className="brand-icon">🏪</span>
          <div>
            <h1>StockSmart</h1>
            <p>Planejador de estoque sazonal · Knapsack + Selos (PD)</p>
          </div>
        </div>
        <div style={{ fontSize: 12, color: "var(--muted)", textAlign: "right" }}>
          <div>Knapsack iterativo: O(n×W)</div>
          <div>Recursivo + memoização</div>
          <div>Coin Change: O(n×W)</div>
        </div>
      </header>

      {erro && <div className="alert a-err">{erro}</div>}
      {msg  && <div className={`alert a-${msg.tipo}`}>{msg.texto}</div>}

      {/* Orçamento fixo */}
      <PainelOrcamento orcamento={orcamento} onSalvar={salvarOrcamento} />

      {/* Stats */}
      <div className="stats-row">
        <div className="stat-card"><div className="stat-label">Produtos</div><div className="stat-val">{produtos.length}</div></div>
        <div className="stat-card"><div className="stat-label">Orçamento</div><div className="stat-val info">R$ {orcamento}</div></div>
        <div className="stat-card"><div className="stat-label">Selecionados</div><div className="stat-val ok">{selecionados.length}</div></div>
        <div className="stat-card"><div className="stat-label">Valor máximo</div><div className="stat-val warn">R$ {resultado?.iterativo?.valorMaximo ?? "—"}</div></div>
      </div>

      {/* Abas */}
      <div className="nav-tabs">
        {[["resultado","📊 Resultado"],["produtos","📦 Produtos"],["cadastrar","➕ Cadastrar"]].map(([k, label]) => (
          <button key={k} className={`nav-tab${aba === k ? " active" : ""}`} onClick={() => setAba(k)}>{label}</button>
        ))}
        {loadingOpt && <span style={{ fontSize: 12, color: "var(--muted)", alignSelf: "center", marginLeft: 10 }}>⟳ Otimizando...</span>}
      </div>

      {aba === "resultado" && (
        loading
          ? <p className="muted-msg">Carregando...</p>
          : resultado
            ? <ResultadoAlgoritmos resultado={resultado} />
            : <div className="card"><p className="muted-msg">Cadastre produtos e defina o orçamento para ver a otimização.</p></div>
      )}

      {aba === "produtos" && (
        loading
          ? <p className="muted-msg">Carregando...</p>
          : <TabelaProdutos produtos={produtos} selecionados={selecionados} onRemover={remover} onEditar={editar} />
      )}

      {aba === "cadastrar" && (
        <FormProduto categorias={categorias} onCadastrar={async (p) => { await cadastrar(p); setAba("produtos"); }} />
      )}
    </div>
  );
}
