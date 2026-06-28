const db = require("../data/db");
const { knapsackIterativo, knapsackRecursivo, coinChange } = require("./algoritmosController");

// Roda otimização com o orçamento fixo atual
function _rodar(res) {
  const produtos  = db.getProdutos();
  const orcamento = db.getOrcamento();

  if (!produtos.length)
    return res.json({ orcamento, iterativo: null, recursivo: null, troco: null });

  const iterativo = knapsackIterativo(produtos, orcamento);
  const recursivo = knapsackRecursivo(produtos, orcamento);
  const troco     = coinChange(db.denominacoes, iterativo.gastoTotal);

  res.json({ orcamento, iterativo, recursivo, troco, denominacoesDisponiveis: db.denominacoes });
}

// GET /api/produtos — lista produtos + orçamento atual
function listarProdutos(req, res) {
  res.json({ produtos: db.getProdutos(), orcamento: db.getOrcamento(), categorias: db.CATEGORIAS });
}

// GET /api/otimizar — roda com orçamento fixo
function otimizar(req, res) { _rodar(res); }

// POST /api/produtos — cadastra produto
function cadastrarProduto(req, res) {
  const { nome, categoria, preco, peso, valor } = req.body;
  if (!nome || !categoria || preco == null || peso == null || valor == null)
    return res.status(400).json({ erro: "Campos obrigatórios: nome, categoria, preco, peso, valor." });
  if (preco <= 0 || valor <= 0 || peso <= 0)
    return res.status(400).json({ erro: "Preço, valor e peso devem ser maiores que zero." });

  const novo = db.addProduto({ nome, categoria, preco: Number(preco), peso: Number(peso), valor: Number(valor) });
  res.status(201).json({ mensagem: "Produto cadastrado.", produto: novo });
}

// PUT /api/produtos/:id — edita preço/valor/peso de um produto
function editarProduto(req, res) {
  const id     = Number(req.params.id);
  const campos = {};
  ["preco", "valor", "peso"].forEach(k => { if (req.body[k] != null) campos[k] = Number(req.body[k]); });
  if (req.body.nome)      campos.nome      = req.body.nome;
  if (req.body.categoria) campos.categoria = req.body.categoria;

  const atualizado = db.updateProduto(id, campos);
  if (!atualizado) return res.status(404).json({ erro: "Produto não encontrado." });
  res.json({ mensagem: "Produto atualizado.", produto: atualizado });
}

// DELETE /api/produtos/:id — remove produto
function removerProduto(req, res) {
  const ok = db.removeProduto(Number(req.params.id));
  if (!ok) return res.status(404).json({ erro: "Produto não encontrado." });
  res.json({ mensagem: "Produto removido." });
}

// PUT /api/orcamento — atualiza orçamento fixo
function atualizarOrcamento(req, res) {
  const valor = Number(req.body.valor);
  if (!valor || valor <= 0)  return res.status(400).json({ erro: "Informe um orçamento válido." });
  if (valor > 1000)          return res.status(400).json({ erro: "Orçamento máximo R$1000 para demo." });
  db.setOrcamento(valor);
  res.json({ mensagem: "Orçamento atualizado.", orcamento: valor });
}

module.exports = { listarProdutos, otimizar, cadastrarProduto, editarProduto, removerProduto, atualizarOrcamento };
