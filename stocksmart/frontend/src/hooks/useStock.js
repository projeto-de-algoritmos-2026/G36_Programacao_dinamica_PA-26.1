import { useState, useEffect, useCallback } from "react";
import { getProdutos, otimizar, cadastrarProduto, editarProduto, removerProduto, atualizarOrcamento, atualizarCapacidade } from "../services/api";

export function useStock() {
  const [produtos,    setProdutos]    = useState([]);
  const [categorias,  setCategorias]  = useState([]);
  const [orcamento,   setOrcamento]   = useState(0);
  const [capacidade,  setCapacidade]  = useState(0);
  const [resultado,   setResultado]   = useState(null);
  const [loading,     setLoading]     = useState(false);
  const [loadingOpt,  setLoadingOpt]  = useState(false);
  const [erro,        setErro]        = useState(null);
  const [msg,         setMsg]         = useState(null);

  const flash = (texto, tipo = "ok") => {
    setMsg({ texto, tipo });
    setTimeout(() => setMsg(null), 3000);
  };

  const carregar = useCallback(async () => {
    setLoading(true);
    try {
      const { data } = await getProdutos();
      setProdutos(data.produtos);
      setCategorias(data.categorias);
      setOrcamento(data.orcamento);
      setCapacidade(data.capacidade);
    } catch { setErro("Erro ao carregar. Verifique se o backend está rodando."); }
    finally { setLoading(false); }
  }, []);

  const rodarOtimizacao = useCallback(async () => {
    setLoadingOpt(true);
    try {
      const { data } = await otimizar();
      setResultado(data);
    } catch { setErro("Erro ao otimizar."); }
    finally { setLoadingOpt(false); }
  }, []);

  useEffect(() => { carregar(); }, [carregar]);

  // Re-otimiza sempre que produtos, orçamento ou capacidade mudam
  useEffect(() => {
    if (produtos.length > 0 && orcamento > 0 && capacidade > 0) rodarOtimizacao();
  }, [produtos, orcamento, capacidade, rodarOtimizacao]);

  const salvarOrcamento = async (valor) => {
    await atualizarOrcamento(valor);
    setOrcamento(valor);
    flash(`Orçamento atualizado para R$ ${valor}`);
  };

  const salvarCapacidade = async (valor) => {
    await atualizarCapacidade(valor);
    setCapacidade(valor);
    flash(`Capacidade atualizada para ${valor} kg`);
  };

  const cadastrar = async (payload) => {
    const { data } = await cadastrarProduto(payload);
    setProdutos(p => [...p, data.produto]);
    flash(`${data.produto.nome} cadastrado!`);
  };

  const editar = async (id, campos) => {
    const { data } = await editarProduto(id, campos);
    setProdutos(p => p.map(x => x.id === id ? data.produto : x));
    flash("Produto atualizado!");
  };

  const remover = async (id, nome) => {
    await removerProduto(id);
    setProdutos(p => p.filter(x => x.id !== id));
    flash(`${nome} removido do estoque.`, "warn");
  };

  return { produtos, categorias, orcamento, capacidade, resultado, loading, loadingOpt, erro, msg, salvarOrcamento, salvarCapacidade, cadastrar, editar, remover };
}
