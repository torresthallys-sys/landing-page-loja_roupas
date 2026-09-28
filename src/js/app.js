import { PRODUCTS, CATEGORIES, WHATSAPP_NUMBER, STORE_NAME, getProductById, getFeaturedProducts, getByCategory, formatPrice } from './products.js';

const CART_KEY = 'moda-store-cart';
const state = {
  cart: [],
  filter: 'todos',
  selectedProduct: null,
  selectedSize: null,
  quantity: 1
};

// 1. cart operations
function loadCart() {
  const saved = localStorage.getItem(CART_KEY);
  if (saved) {
    try { state.cart = JSON.parse(saved); } catch (e) { state.cart = []; }
  }
}
function saveCart() {
  localStorage.setItem(CART_KEY, JSON.stringify(state.cart));
}
function cartCount() {
  return state.cart.reduce((acc, item) => acc + item.qty, 0);
}
function cartTotal() {
  return state.cart.reduce((acc, item) => acc + (item.price * item.qty), 0);
}

function addToCart(item) {
  const existing = state.cart.find(i => i.id === item.id && i.size === item.size);
  if (existing) {
    existing.qty += item.qty;
  } else {
    state.cart.push(item);
  }
  saveCart();
  renderCart();
  updateBadge();
  showToast();
}

function updateQty(id, size, delta) {
  const item = state.cart.find(i => i.id === id && i.size === size);
  if (item) {
    item.qty += delta;
    if (item.qty < 1) item.qty = 1;
    saveCart();
    renderCartItems();
    updateBadge();
    document.getElementById('cart-total-value').innerText = formatPrice(cartTotal());
  }
}

function removeItem(id, size) {
  state.cart = state.cart.filter(i => !(i.id === id && i.size === size));
  saveCart();
  renderCart();
  updateBadge();
}

function clearCart() {
  state.cart = [];
  saveCart();
  renderCart();
  updateBadge();
}

function renderCart() {
  const body = document.getElementById('cart-body');
  if (state.cart.length === 0) {
    body.innerHTML = '<p class="muted">Seu carrinho está vazio.</p>';
  } else {
    renderCartItems();
  }
  document.getElementById('cart-total-value').innerText = formatPrice(cartTotal());
}

function renderCartItems() {
  const body = document.getElementById('cart-body');
  if (state.cart.length === 0) return; 
  
  body.innerHTML = state.cart.map(item => `
    <div class="cart-item">
      <img src="${item.image}" alt="${item.name}" class="cart-item-img">
      <div class="cart-item-info">
        <div class="cart-item-title">${item.name}</div>
        <div class="cart-item-meta">${item.size ? 'Tam: ' + item.size : ''}</div>
        <div class="cart-item-meta" style="color: var(--accent); font-weight:600;">${formatPrice(item.price)}</div>
        <div class="cart-item-bot">
          <div class="cart-qty-ctrl">
            <button data-qty="-1" data-id="${item.id}" data-size="${item.size || ''}">-</button>
            <span>${item.qty}</span>
            <button data-qty="1" data-id="${item.id}" data-size="${item.size || ''}">+</button>
          </div>
          <button class="cart-item-remove" data-remove="true" data-id="${item.id}" data-size="${item.size || ''}">Remover</button>
        </div>
      </div>
    </div>
  `).join('');
}

function updateBadge() {
  const badge = document.getElementById('cart-badge');
  const count = cartCount();
  if (count > 0) {
    badge.innerText = count;
    badge.style.display = 'flex';
  } else {
    badge.style.display = 'none';
  }
}

function buildWhatsAppMessage() {
  let msg = `Olá ${STORE_NAME}! Gostaria de finalizar meu pedido:\n\n`;
  state.cart.forEach(item => {
    msg += `${item.qty}x ${item.name}${item.size ? ' (Tam: ' + item.size + ')' : ''} - ${formatPrice(item.price * item.qty)}\n`;
  });
  msg += `\n*Total: ${formatPrice(cartTotal())}*`;
  return encodeURIComponent(msg);
}

function checkoutWhatsApp() {
  if (state.cart.length === 0) return;
  const url = `https://wa.me/${WHATSAPP_NUMBER}?text=${buildWhatsAppMessage()}`;
  window.open(url, '_blank');
}

// 2. UI rendering
let observer;
function observeAnimationTarget(element) {
  const observeStaggerChildren = element.id === 'catalog-grid'
    && window.matchMedia('(max-width: 768px)').matches
    && element.children.length > 0;

  if (observeStaggerChildren) {
    Array.from(element.children).forEach(child => observer.observe(child));
  } else {
    observer.observe(element);
  }
}

function initScrollAnimations() {
  observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const target = entry.target.parentElement?.classList.contains('stagger')
          ? entry.target.parentElement
          : entry.target;
        target.classList.add('is-visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 });

  document.querySelectorAll('.reveal, .reveal-scale, .stagger').forEach(observeAnimationTarget);
}

function observeNewElements(container) {
  if (observer) {
    if (container.classList.contains('stagger')) observeAnimationTarget(container);
    container.querySelectorAll('.reveal, .reveal-scale, .stagger').forEach(observeAnimationTarget);
  }
}

function renderProducts(list) {
  const grid = document.getElementById('catalog-grid');
  grid.classList.remove('is-visible');
  
  grid.innerHTML = list.map(p => `
    <div class="product-card" data-open-product="${p.id}">
      <div class="product-img-wrap">
        ${p.featured ? '<span class="product-badge">Destaque</span>' : ''}
        <img src="${p.image}" alt="${p.name}" loading="lazy">
      </div>
      <div class="product-info">
        <h3>${p.name}</h3>
        <span class="product-price">${formatPrice(p.price)}</span>
      </div>
    </div>
  `).join('');
  
  void grid.offsetWidth;
  observeNewElements(grid);
}

function renderFilters() {
  const wrap = document.getElementById('filters-wrap');
  wrap.innerHTML = CATEGORIES.map(c => `
    <button class="filter-btn ${state.filter === c.id ? 'is-active' : ''}" data-filter="${c.id}">${c.label}</button>
  `).join('');
}

function applyFilter(category) {
  state.filter = category;
  renderFilters();
  renderProducts(getByCategory(category));
}

function renderCategories() {
  const grid = document.getElementById('cat-grid');
  const cats = CATEGORIES.filter(c => c.id !== 'todos').slice(0, 6);
  const imgs = ['produto-01.jpg', 'produto-02.jpg', 'produto-03.jpg', 'produto-04.jpg', 'produto-05.jpg', 'produto-01.jpg'];
  
  grid.innerHTML = cats.map((c, i) => `
    <a class="cat-card" data-filter="${c.id}" href="#colecao">
      <img src="/assets/images/${imgs[i] || 'produto-01.jpg'}" alt="${c.label}" loading="lazy">
      <span class="cat-label">${c.label}</span>
    </a>
  `).join('');
}

// 3. Modal
function openModal(id) {
  const product = getProductById(id);
  if (!product) return;
  state.selectedProduct = product;
  state.selectedSize = null;
  state.quantity = 1;

  document.getElementById('modal-img').src = product.image;
  document.getElementById('modal-title').innerText = product.name;
  document.getElementById('modal-price').innerText = formatPrice(product.price);
  document.getElementById('modal-desc').innerText = product.description;
  document.getElementById('modal-qty-val').innerText = state.quantity;

  const sizeGrid = document.getElementById('modal-size-grid');
  if (product.sizes && product.sizes.length > 0) {
    sizeGrid.innerHTML = product.sizes.map(s => `<button class="size-btn" data-size="${s}">${s}</button>`).join('');
    sizeGrid.parentElement.style.display = 'block';
  } else {
    sizeGrid.innerHTML = '';
    sizeGrid.parentElement.style.display = 'none';
  }

  document.getElementById('product-modal').classList.add('is-open');
}

function closeModal() {
  document.getElementById('product-modal').classList.remove('is-open');
  state.selectedProduct = null;
}

function showToast() {
  const toast = document.getElementById('toast');
  toast.classList.add('show');
  setTimeout(() => toast.classList.remove('show'), 3000);
}

// 4. Initializers
function initHeroAnimation() {
  const hero = document.getElementById('hero');
  if(hero) hero.querySelectorAll('.reveal, .reveal-scale, .stagger').forEach(el => el.classList.add('is-visible'));
}

function initNav() {
  const nav = document.querySelector('.nav');
  window.addEventListener('scroll', () => {
    if (window.scrollY > 50) nav.classList.add('is-scrolled');
    else nav.classList.remove('is-scrolled');
  });
}

function initMobileMenu() {
  const menu = document.getElementById('mobile-menu');
  document.getElementById('mobile-menu-btn').addEventListener('click', () => menu.classList.add('is-open'));
  document.getElementById('mobile-menu-close').addEventListener('click', () => menu.classList.remove('is-open'));
  menu.querySelectorAll('a').forEach(a => a.addEventListener('click', () => menu.classList.remove('is-open')));
}

function initCart() {
  const drawer = document.getElementById('cart-drawer');
  document.getElementById('cart-btn').addEventListener('click', () => drawer.classList.add('is-open'));
  document.getElementById('cart-close').addEventListener('click', () => drawer.classList.remove('is-open'));
  document.getElementById('cart-overlay').addEventListener('click', () => drawer.classList.remove('is-open'));
  document.getElementById('cart-checkout').addEventListener('click', checkoutWhatsApp);
}

function bindEvents() {
  document.body.addEventListener('click', (e) => {
    
    // Filters
    const filterBtn = e.target.closest('[data-filter]');
    if (filterBtn) {
      if(filterBtn.tagName !== 'A') e.preventDefault(); // if button
      applyFilter(filterBtn.getAttribute('data-filter'));
    }

    // Open Product Modal
    const productCard = e.target.closest('[data-open-product]');
    if (productCard) {
      openModal(productCard.getAttribute('data-open-product'));
    }

    // Modal size select
    const sizeBtn = e.target.closest('[data-size]');
    if (sizeBtn && sizeBtn.closest('#modal-size-grid')) {
      document.querySelectorAll('#modal-size-grid .size-btn').forEach(b => b.classList.remove('is-selected'));
      sizeBtn.classList.add('is-selected');
      state.selectedSize = sizeBtn.getAttribute('data-size');
    }

    // Cart qty updates
    const qtyBtn = e.target.closest('[data-qty]');
    if (qtyBtn) {
      const isCart = qtyBtn.closest('#cart-body');
      if (isCart) {
        updateQty(qtyBtn.getAttribute('data-id'), qtyBtn.getAttribute('data-size'), parseInt(qtyBtn.getAttribute('data-qty')));
      } else {
        // Modal qty
        state.quantity += parseInt(qtyBtn.getAttribute('data-qty'));
        if (state.quantity < 1) state.quantity = 1;
        document.getElementById('modal-qty-val').innerText = state.quantity;
      }
    }

    // Cart remove
    const removeBtn = e.target.closest('[data-remove]');
    if (removeBtn) {
      removeItem(removeBtn.getAttribute('data-id'), removeBtn.getAttribute('data-size'));
    }

    // Modal Add
    if (e.target.id === 'modal-add') {
      if (!state.selectedProduct) return;
      if (state.selectedProduct.sizes && state.selectedProduct.sizes.length > 0 && !state.selectedSize) {
        alert('Por favor, selecione um tamanho.');
        return;
      }
      addToCart({
        id: state.selectedProduct.id,
        name: state.selectedProduct.name,
        price: state.selectedProduct.price,
        image: state.selectedProduct.image,
        size: state.selectedSize,
        qty: state.quantity
      });
      closeModal();
    }

    // Close Modal overlay/close btn
    if (e.target.id === 'modal-overlay' || e.target.closest('#modal-close')) {
      closeModal();
    }
  });
}

function init() {
  loadCart();
  renderCategories();
  renderFilters();
  renderProducts(PRODUCTS); 
  renderCart();
  updateBadge();
  
  initNav();
  initMobileMenu();
  initCart();
  bindEvents();
  initScrollAnimations();
  
  setTimeout(initHeroAnimation, 100);
}

document.addEventListener('DOMContentLoaded', init);
