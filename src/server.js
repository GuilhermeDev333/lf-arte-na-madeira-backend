import express from 'express';
import cors from 'cors';
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import path from 'path';

// Carrega o .env APENAS se estiver rodando localmente (em desenvolvimento)
if (process.env.NODE_ENV !== 'production') {
    dotenv.config();
}

const app = express();

// 📂 Define a pasta 'public' para servir o HTML, CSS e Imagens de forma correta
app.use(express.static(path.resolve(process.cwd(), 'public')));

// Configurações de tamanho para aguentar fotos em Base64
app.use(cors());
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

// 🔌 Conexão com o Supabase (puxa tanto do .env local quanto das variáveis da Vercel)
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_KEY;

if (!supabaseUrl || !supabaseKey) {
    console.error("❌ CRÍTICO: Variáveis de ambiente do Supabase não foram encontradas!");
}

const supabase = createClient(supabaseUrl || '', supabaseKey || '');

// --- ROTAS PARA PRODUTOS ---

// Buscar Produtos
app.get('/api/produtos', async (req, res) => {
    try {
        const { data, error } = await supabase
            .from('produtos')
            .select('*')
            .order('id', { ascending: false });

        if (error) throw error;
        res.json(data);
    } catch (err) {
        console.error("❌ ERRO DETALHADO DOS PRODUTOS:", err);
        console.log("⚠️ Entregando produto temporário local...");
        res.json([{ id: 1, nome: "Tábua de Teste (Erro no Banco)", preco: 99.90, imagem_url: "logo_oficina.png", categoria: "todos" }]);
    }
});

// Cadastrar Produto
app.post('/api/produtos', async (req, res) => {
    const { nome, categoria, preco, tipo_madeira, tamanho, imagem_url } = req.body;
    try {
        const { data, error } = await supabase
            .from('produtos')
            .insert([{ nome, categoria, preco, tipo_madeira, tamanho, imagem_url }])
            .select();

        if (error) throw error;
        res.status(201).json(data[0]);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Deletar Produto
app.delete('/api/produtos/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const { error } = await supabase.from('produtos').delete().eq('id', id);
        if (error) throw error;
        res.sendStatus(200);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});


// --- ROTAS PARA CATEGORIAS ---

// Buscar Categorias
app.get('/api/categorias', async (req, res) => {
    try {
        const { data, error } = await supabase.from('categorias').select('*');
        if (error) throw error;
        res.json(data);
    } catch (err) {
        console.error("❌ ERRO DETALHADO DAS CATEGORIAS:", err);
        console.log("⚠️ Entregando categoria temporária local...");
        res.json([{ id: 'todos', nome: 'Geral (Modo Offline)' }]);
    }
});

// Cadastrar Categoria
app.post('/api/categorias', async (req, res) => {
    const { id, nome } = req.body;
    try {
        const { data, error } = await supabase.from('categorias').insert([{ id, nome }]).select();
        if (error) throw error;
        res.status(201).json(data[0]);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Deletar Categoria
app.delete('/api/categorias/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const { error } = await supabase.from('categorias').delete().eq('id', id);
        if (error) throw error;
        res.sendStatus(200);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Rota principal: entrega o arquivo correto de dentro da pasta public
app.get('/', (req, res) => {
    res.sendFile(path.resolve(process.cwd(), 'public', 'index.html'));
});

export default app;