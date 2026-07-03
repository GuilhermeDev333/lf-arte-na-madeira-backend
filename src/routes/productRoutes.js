// src/routes/productRoutes.js
import express from 'express';
import ProductRepository from '../repositories/ProductRepository.js'; // Ajuste o caminho dos pontos se necessário

const router = express.Router();

// Listar categorias
router.get('/categorias', async (req, res) => {
    const cats = await ProductRepository.getCategories();
    res.json(cats);
});

// Criar categoria
router.post('/categorias', async (req, res) => {
    const { nome } = req.body;
    if (!nome) return res.status(400).json({ erro: "Nome da categoria é obrigatório." });

    const novaCat = await ProductRepository.createCategory(nome);
    if (!novaCat) return res.status(400).json({ erro: "Esta categoria já existe." });

    res.status(201).json(novaCat);
});

// Deletar categoria
router.delete('/categorias/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const excluido = await ProductRepository.deleteCategory(id);
        
        if (!excluido) return res.status(404).json({ erro: "Categoria não encontrada." });
        res.json({ mensagem: "Categoria removida com sucesso!" });
    } catch (error) {
        res.status(400).json({ erro: error.message });
    }
});

// Listar produtos
router.get('/produtos', async (req, res) => {
    const prods = await ProductRepository.findAll();
    res.json(prods);
});

// Criar produto
router.post('/produtos', async (req, res) => {
    const novoProduto = await ProductRepository.create(req.body);
    res.status(201).json(novoProduto);
});

// Deletar produto
router.delete('/produtos/:id', async (req, res) => {
    const { id } = req.params;
    const excluido = await ProductRepository.delete(id);
    
    if (!excluido) return res.status(404).json({ erro: "Produto não encontrado." });
    res.json({ mensagem: "Produto removido com sucesso!" });
});

export default router;