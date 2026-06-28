import axios from "axios";
const api = axios.create({ baseURL: "/api" });

export const getProdutos       = ()          => api.get("/produtos");
export const otimizar          = ()          => api.get("/otimizar");
export const cadastrarProduto  = (payload)   => api.post("/produtos", payload);
export const editarProduto     = (id, data)  => api.put(`/produtos/${id}`, data);
export const removerProduto    = (id)        => api.delete(`/produtos/${id}`);
export const atualizarOrcamento = (valor)    => api.put("/orcamento", { valor });
