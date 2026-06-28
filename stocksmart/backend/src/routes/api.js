const express = require("express");
const router  = express.Router();
const ctrl    = require("../controllers/stockController");

router.get("/produtos",          ctrl.listarProdutos);
router.post("/produtos",         ctrl.cadastrarProduto);
router.put("/produtos/:id",      ctrl.editarProduto);
router.delete("/produtos/:id",   ctrl.removerProduto);
router.get("/otimizar",          ctrl.otimizar);
router.put("/orcamento",         ctrl.atualizarOrcamento);
router.put("/capacidade",        ctrl.atualizarCapacidade);

module.exports = router;
