// src/repositories/ProductRepository.js

// src/repositories/ProductRepository.js
// src/repositories/ProductRepository.js
// src/repositories/ProductRepository.js
// src/repositories/ProductRepository.js
class ProductRepository {
  constructor() {
    this.imagemPadrao = "https://images.unsplash.com/photo-1533090161767-e6ffed986c88?q=80&w=500&auto=format&fit=crop";

    this.categories = [
      { id: "tabuas", nome: "Tábuas de Carne" },
      { id: "petisqueiras", nome: "Petisqueiras" },
      { id: "decoracao", nome: "Decoração / Utensílios" },
      { id: "outros", nome: "Outros" }
    ];

    this.products = [
      {
        id: 1,
        nome: "Tábua de Churrasco Premium",
        descricao: "Madeira maciça de alta densidade.",
        preco: 149.90,
        permite_personalizacao: true,
        imagem_url: "https://images.unsplash.com/photo-1619535860434-ba1d8fa12536?q=80&w=500&auto=format&fit=crop",
        categoria: "tabuas",
        tipo_madeira: "Muiracatiara",
        tamanho: "50cm x 30cm x 3.5cm"
      }
    ];
  }

  async findAll() {
    return this.products;
  }

  async create(productData) {
    const { nome, descricao, preco, permite_personalizacao, imagem_url, categoria, tipo_madeira, tamanho } = productData;

    const newProduct = {
      id: Date.now(), // 💡 Mudado para Date.now() para evitar IDs repetidos ao deletar e criar itens
      nome,
      descricao,
      preco: Number(preco),
      permite_personalizacao: permite_personalizacao ?? true,
      imagem_url: imagem_url && imagem_url.trim() !== "" ? imagem_url : this.imagemPadrao,
      categoria: categoria || "outros",
      tipo_madeira: tipo_madeira || "Não informada",
      tamanho: tamanho || "Não informado"
    };

    this.products.push(newProduct);
    return newProduct;
  }

  // 🔥 NOVO MÉTODO: Deletar Produto
  async delete(id) {
    const index = this.products.findIndex(p => p.id === Number(id));
    if (index === -1) return false;
    
    this.products.splice(index, 1);
    return true;
  }

  async getCategories() { 
    return this.categories; 
  }

  async createCategory(nomeCategoria) {
    const id = nomeCategoria.toLowerCase().trim().normalize('NFD').replace(/[\u0300-\u036f]/g, "").replace(/\s+/g, '-');
    
    // Evita IDs duplicados
    const existe = this.categories.find(c => c.id === id);
    if (existe) return null;

    const novaCategoria = { id, nome: nomeCategoria };
    this.categories.push(novaCategoria);
    return novaCategoria;
  }

  // 🔥 NOVO MÉTODO: Deletar Categoria
  async deleteCategory(id) {
    // Impede deletar se houver produtos vinculados nesta categoria
    const temProdutos = this.products.some(p => p.categoria === id);
    if (temProdutos) throw new Error("Não é possível excluir. Existem produtos nesta categoria!");

    const index = this.categories.findIndex(c => c.id === id);
    if (index === -1) return false;

    this.categories.splice(index, 1);
    return true;
  }
}

export default new ProductRepository();