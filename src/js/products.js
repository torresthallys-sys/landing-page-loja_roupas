export const WHATSAPP_NUMBER = '5562999999999';
export const STORE_NAME = 'VESTE';

export const CATEGORIES = [
  { id: 'todos', label: 'Todos' },
  { id: 'camisetas', label: 'Camisetas' },
  { id: 'calcas', label: 'Calças' },
  { id: 'vestidos', label: 'Vestidos' },
  { id: 'conjuntos', label: 'Conjuntos' },
  { id: 'acessorios', label: 'Acessórios' }
];

export const PRODUCTS = [
  {
    id: 'p1',
    name: 'Camiseta Essential',
    description: 'Camiseta básica premium para o dia a dia.',
    price: 89.90,
    category: 'camisetas',
    image: '/assets/images/produto-01.jpg',
    sizes: ['P', 'M', 'G', 'GG'],
    featured: true
  },
  {
    id: 'p2',
    name: 'Camiseta Oversized',
    description: 'Caimento solto e confortável.',
    price: 109.90,
    category: 'camisetas',
    image: '/assets/images/produto-02.jpg',
    sizes: ['P', 'M', 'G', 'GG'],
    featured: true
  },
  {
    id: 'p3',
    name: 'Camiseta Estampada',
    description: 'Estampa exclusiva com design moderno.',
    price: 99.90,
    category: 'camisetas',
    image: '/assets/images/produto-03.jpg',
    sizes: ['P', 'M', 'G', 'GG'],
    featured: false
  },
  {
    id: 'p4',
    name: 'Camiseta Basic Branca',
    description: 'A clássica que não pode faltar.',
    price: 79.90,
    category: 'camisetas',
    image: '/assets/images/produto-04.jpg',
    sizes: ['P', 'M', 'G', 'GG'],
    featured: false
  },
  {
    id: 'p5',
    name: 'Calça Slim Fit',
    description: 'Corte ajustado que modela o corpo.',
    price: 179.90,
    category: 'calcas',
    image: '/assets/images/produto-05.jpg',
    sizes: ['36', '38', '40', '42', '44'],
    featured: true
  },
  {
    id: 'p6',
    name: 'Calça Wide Leg',
    description: 'Tendência e conforto em uma só peça.',
    price: 199.90,
    category: 'calcas',
    image: '/assets/images/produto-01.jpg',
    sizes: ['36', '38', '40', '42', '44'],
    featured: false
  },
  {
    id: 'p7',
    name: 'Vestido Midi',
    description: 'Elegância para qualquer ocasião.',
    price: 229.90,
    category: 'vestidos',
    image: '/assets/images/produto-02.jpg',
    sizes: ['P', 'M', 'G'],
    featured: true
  },
  {
    id: 'p8',
    name: 'Vestido Casual',
    description: 'Leve e perfeito para os dias quentes.',
    price: 189.90,
    category: 'vestidos',
    image: '/assets/images/produto-03.jpg',
    sizes: ['P', 'M', 'G'],
    featured: false
  },
  {
    id: 'p9',
    name: 'Conjunto Moletom',
    description: 'Para os dias de frio com estilo.',
    price: 259.90,
    category: 'conjuntos',
    image: '/assets/images/produto-04.jpg',
    sizes: ['P', 'M', 'G', 'GG'],
    featured: true
  },
  {
    id: 'p10',
    name: 'Conjunto Jeans',
    description: 'Visual completo e despojado.',
    price: 299.90,
    category: 'conjuntos',
    image: '/assets/images/produto-05.jpg',
    sizes: ['P', 'M', 'G'],
    featured: false
  },
  {
    id: 'p11',
    name: 'Cinto Premium',
    description: 'Acabamento em couro sintético de alta qualidade.',
    price: 69.90,
    category: 'acessorios',
    image: '/assets/images/produto-01.jpg',
    sizes: [],
    featured: false
  },
  {
    id: 'p12',
    name: 'Bolsa Tote',
    description: 'Espaçosa e elegante para o trabalho ou passeio.',
    price: 149.90,
    category: 'acessorios',
    image: '/assets/images/produto-02.jpg',
    sizes: [],
    featured: true
  }
];

export function getProductById(id) {
  return PRODUCTS.find(p => p.id === id);
}

export function getFeaturedProducts() {
  return PRODUCTS.filter(p => p.featured);
}

export function getByCategory(category) {
  if (category === 'todos') return PRODUCTS;
  return PRODUCTS.filter(p => p.category === category);
}

export function formatPrice(value) {
  return value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
}
