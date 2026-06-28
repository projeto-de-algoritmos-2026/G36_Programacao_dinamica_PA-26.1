let proximoId = 16;

let produtos = [
  { id: 1,  nome: "Arroz 5kg",          categoria: "Alimentos",    preco: 28,  peso: 5,  valor: 35 },
  { id: 2,  nome: "Feijão 1kg",         categoria: "Alimentos",    preco: 9,   peso: 1,  valor: 12 },
  { id: 3,  nome: "Azeite 500ml",       categoria: "Alimentos",    preco: 32,  peso: 1,  valor: 45 },
  { id: 4,  nome: "Shampoo 400ml",      categoria: "Higiene",      preco: 18,  peso: 1,  valor: 25 },
  { id: 5,  nome: "Sabonete cx12",      categoria: "Higiene",      preco: 22,  peso: 2,  valor: 30 },
  { id: 6,  nome: "Detergente cx6",     categoria: "Limpeza",      preco: 15,  peso: 3,  valor: 20 },
  { id: 7,  nome: "Café 500g",          categoria: "Bebidas",      preco: 24,  peso: 1,  valor: 38 },
  { id: 8,  nome: "Biscoito cx10",      categoria: "Alimentos",    preco: 35,  peso: 4,  valor: 48 },
  { id: 9,  nome: "Leite cx12",         categoria: "Bebidas",      preco: 55,  peso: 12, valor: 72 },
  { id: 10, nome: "Macarrão cx10",      categoria: "Alimentos",    preco: 30,  peso: 5,  valor: 40 },
  { id: 11, nome: "Molho Tomate cx12",  categoria: "Alimentos",    preco: 36,  peso: 6,  valor: 50 },
  { id: 12, nome: "Papel Higiênico",    categoria: "Higiene",      preco: 42,  peso: 4,  valor: 55 },
  { id: 13, nome: "Água Mineral cx20",  categoria: "Bebidas",      preco: 48,  peso: 20, valor: 60 },
  { id: 14, nome: "Sabão em Pó 1kg",   categoria: "Limpeza",      preco: 19,  peso: 2,  valor: 26 },
  { id: 15, nome: "Achocolatado cx12",  categoria: "Bebidas",      preco: 62,  peso: 8,  valor: 80 },
];

// Orçamento fixo da loja — pode ser alterado via API
let orcamentoFixo = 150;

const denominacoes = [1, 2, 5, 10, 20, 50, 100];

const CATEGORIAS = ["Alimentos", "Bebidas", "Higiene", "Limpeza"];

function getProdutos()          { return produtos; }
function getOrcamento()         { return orcamentoFixo; }
function setOrcamento(v)        { orcamentoFixo = v; }

function addProduto(p) {
  const novo = { ...p, id: proximoId++ };
  produtos.push(novo);
  return novo;
}

function removeProduto(id) {
  const idx = produtos.findIndex(p => p.id === id);
  if (idx === -1) return false;
  produtos.splice(idx, 1);
  return true;
}

function updateProduto(id, campos) {
  const p = produtos.find(p => p.id === id);
  if (!p) return null;
  Object.assign(p, campos);
  return p;
}

module.exports = { getProdutos, getOrcamento, setOrcamento, addProduto, removeProduto, updateProduto, denominacoes, CATEGORIAS };
