/* ================================================
   GUCCI CLONE — SHARED JAVASCRIPT
   ================================================ */

// ── State ─────────────────────────────────────────
const state = {
  cart: JSON.parse(localStorage.getItem('gucciCart') || '[]'),
  wishlist: JSON.parse(localStorage.getItem('gucciWishlist') || '[]')
};

function saveState() {
  localStorage.setItem('gucciCart', JSON.stringify(state.cart));
  localStorage.setItem('gucciWishlist', JSON.stringify(state.wishlist));
}

// ── Cart ──────────────────────────────────────────
function addToCart(product) {
  const existing = state.cart.find(i => i.id === product.id && i.size === product.size);
  if (existing) {
    existing.qty++;
  } else {
    state.cart.push({ ...product, qty: 1 });
  }
  saveState();
  updateCartBadge();
  renderCart();
  showToast(`Added to bag — ${product.name}`);
}

function removeFromCart(id, size) {
  state.cart = state.cart.filter(i => !(i.id === id && i.size === size));
  saveState();
  updateCartBadge();
  renderCart();
}

function changeQty(id, size, delta) {
  const item = state.cart.find(i => i.id === id && i.size === size);
  if (!item) return;
  item.qty = Math.max(1, item.qty + delta);
  saveState();
  renderCart();
  updateCartBadge();
}

function updateCartBadge() {
  const total = state.cart.reduce((acc, i) => acc + i.qty, 0);
  document.querySelectorAll('.cart-badge').forEach(el => {
    el.textContent = total;
    el.style.display = total > 0 ? 'inline-flex' : 'none';
  });
}

function getCartTotal() {
  return state.cart.reduce((acc, i) => acc + i.price * i.qty, 0);
}

function renderCart() {
  const body = document.querySelector('.cart-body');
  const subtotalEl = document.querySelector('.cart-subtotal strong');
  if (!body) return;

  if (state.cart.length === 0) {
    body.innerHTML = `
      <div class="cart-empty">
        <p>Your bag is empty</p>
        <a href="index.html" class="btn btn-primary">Explore Collection</a>
      </div>`;
  } else {
    body.innerHTML = state.cart.map(item => `
      <div class="cart-item">
        <img class="cart-item-img" src="${item.image}" alt="${item.name}">
        <div class="cart-item-info">
          <p class="cart-item-name">${item.name}</p>
          <p class="cart-item-detail">Size: ${item.size} &nbsp;·&nbsp; Color: ${item.color || 'Black'}</p>
          <div class="cart-item-actions">
            <div class="qty-control">
              <button class="qty-btn" onclick="changeQty('${item.id}','${item.size}',-1)">−</button>
              <span class="qty-value">${item.qty}</span>
              <button class="qty-btn" onclick="changeQty('${item.id}','${item.size}',1)">+</button>
            </div>
            <span class="cart-item-price">₹${(item.price * item.qty).toLocaleString('en-IN')}</span>
          </div>
          <button class="cart-item-remove" onclick="removeFromCart('${item.id}','${item.size}')">Remove</button>
        </div>
      </div>
    `).join('');
  }

  if (subtotalEl) {
    subtotalEl.textContent = `₹${getCartTotal().toLocaleString('en-IN')}`;
  }
}

// ── Cart Drawer ───────────────────────────────────
function openCart() {
  document.querySelector('.cart-overlay')?.classList.add('open');
  document.querySelector('.cart-drawer')?.classList.add('open');
  document.body.style.overflow = 'hidden';
}

function closeCart() {
  document.querySelector('.cart-overlay')?.classList.remove('open');
  document.querySelector('.cart-drawer')?.classList.remove('open');
  document.body.style.overflow = '';
}

// ── Product Rendering Engine ─────────────────────────
function getAllProducts() {
  if (typeof PRODUCTS === 'undefined') return [];
  const all = [];
  Object.values(PRODUCTS).forEach(arr => { if (Array.isArray(arr)) all.push(...arr); });
  return all;
}

function getProductsByCategories(keys) {
  if (typeof PRODUCTS === 'undefined') return [];
  const items = [];
  keys.forEach(k => { if (PRODUCTS[k]) items.push(...PRODUCTS[k]); });
  return items;
}

function findProduct(id) {
  return getAllProducts().find(p => p.id === id);
}

function productCardHTML(p) {
  const priceStr = '₹' + p.price.toLocaleString('en-IN');
  const esc = p.name.replace(/'/g, "\\'");
  return `<article class="product-card" data-price="${p.price}" data-cat="${p.subcategory || p.category}" data-category="${p.category}">
    <div class="product-card-image">
      <a href="product.html?id=${p.id}">
        <img class="img-primary" src="${p.image}" alt="${p.name}" loading="lazy" width="600" height="750">
      </a>
      <button class="product-card-wishlist wishlist-btn" data-id="${p.id}" onclick="toggleWishlist('${p.id}')" aria-label="Wishlist"><svg viewBox="0 0 24 24"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg></button>
    </div>
    <div class="product-card-info">
      <a href="product.html?id=${p.id}"><h3 class="product-card-name">${p.name}</h3></a>
      <p class="product-card-price">${priceStr}</p>
    </div>
  </article>`;
}

function renderProductGrid(containerId, products, limit) {
  const el = document.getElementById(containerId);
  if (!el || !products.length) return;
  const show = limit ? products.slice(0, limit) : products;
  el.innerHTML = show.map(p => productCardHTML(p)).join('');
  // mark wishlisted items
  el.querySelectorAll('.wishlist-btn').forEach(btn => {
    if (state.wishlist.includes(btn.dataset.id)) btn.classList.add('active');
  });
}

// Build dynamic search index from PRODUCTS
const searchProducts = (function() {
  const all = getAllProducts();
  return all.map(p => ({
    id: p.id, name: p.name, price: p.price,
    category: p.subcategory || p.category,
    url: 'product.html?id=' + p.id
  }));
})();

// Build dynamic wishlist lookup from PRODUCTS
const wishlistProducts = (function() {
  const map = {};
  getAllProducts().forEach(p => {
    map[p.id] = { name: p.name, price: p.price, image: p.image, color: 'Default' };
  });
  return map;
})();

let searchActiveIndex = -1;
const SEARCH_MAX = 6;

function openSearch() {
  const overlay = document.querySelector('.search-overlay');
  const input = document.querySelector('.search-input');
  if (!overlay) return;
  overlay.classList.add('open');
  document.body.style.overflow = 'hidden';
  // Reset state
  if (input) {
    input.value = '';
    setTimeout(() => input.focus(), 100);
  }
  searchActiveIndex = -1;
  renderSearchState('');
}

function closeSearch() {
  document.querySelector('.search-overlay')?.classList.remove('open');
  document.body.style.overflow = '';
  searchActiveIndex = -1;
}

function highlightMatch(text, query) {
  if (!query) return text;
  const regex = new RegExp(`(${query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'gi');
  return text.replace(regex, '<mark>$1</mark>');
}

function renderSearchState(query) {
  const resultsEl = document.querySelector('.search-results');
  if (!resultsEl) return;

  const trimmed = query.trim().toLowerCase();

  if (!trimmed) {
    resultsEl.innerHTML = '';
    searchActiveIndex = -1;
    return;
  }

  const matches = searchProducts.filter(p =>
    p.name.toLowerCase().includes(trimmed) ||
    p.category.toLowerCase().includes(trimmed)
  );

  if (matches.length === 0) {
    resultsEl.innerHTML = `<div class="search-no-results">No results found for "${query}"</div>`;
    searchActiveIndex = -1;
    return;
  }

  const shown = matches.slice(0, SEARCH_MAX);
  let html = shown.map((p, i) => `
    <a href="${p.url}" class="search-result-item" data-index="${i}">
      <div class="search-result-left">
        <span class="search-result-name">${highlightMatch(p.name, trimmed)}</span>
        <span class="search-result-price">₹${p.price.toLocaleString('en-IN')}</span>
      </div>
      <span class="search-result-category">${p.category}</span>
    </a>
  `).join('');


  resultsEl.innerHTML = html;
  searchActiveIndex = -1;
}

function updateSearchKbActive() {
  const items = document.querySelectorAll('.search-result-item, .search-see-all');
  items.forEach((el, i) => {
    el.classList.toggle('kb-active', i === searchActiveIndex);
  });
  // Scroll active item into view
  if (searchActiveIndex >= 0 && items[searchActiveIndex]) {
    items[searchActiveIndex].scrollIntoView({ block: 'nearest' });
  }
}

function initSearch() {
  const input = document.querySelector('.search-input');
  if (!input) return;

  input.addEventListener('input', () => {
    renderSearchState(input.value);
  });

  input.addEventListener('keydown', (e) => {
    const items = document.querySelectorAll('.search-result-item, .search-see-all');
    const count = items.length;

    if (e.key === 'ArrowDown') {
      e.preventDefault();
      searchActiveIndex = (searchActiveIndex + 1) % count;
      updateSearchKbActive();
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      searchActiveIndex = searchActiveIndex <= 0 ? count - 1 : searchActiveIndex - 1;
      updateSearchKbActive();
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (searchActiveIndex >= 0 && items[searchActiveIndex]) {
        window.location.href = items[searchActiveIndex].href;
      }
    }
  });
}

// ── Wishlist ──────────────────────────────────────
function toggleWishlist(id) {
  const idx = state.wishlist.indexOf(id);
  if (idx === -1) {
    state.wishlist.push(id);
    showToast('Added to Wishlist');
  } else {
    state.wishlist.splice(idx, 1);
  }
  saveState();
  document.querySelectorAll(`.wishlist-btn[data-id="${id}"]`).forEach(btn => {
    btn.classList.toggle('active', state.wishlist.includes(id));
  });
}

// ── Toast ─────────────────────────────────────────
let toastTimer;
function showToast(msg) {
  const t = document.querySelector('.toast');
  if (!t) return;
  t.querySelector('.toast-msg').textContent = msg;
  t.classList.add('show');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => t.classList.remove('show'), 3500);
}

// ── Scroll Reveal ─────────────────────────────────
function initReveal() {
  const obs = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.classList.add('visible');
        obs.unobserve(e.target);
      }
    });
  }, { threshold: 0.12 });

  document.querySelectorAll('.reveal').forEach(el => obs.observe(el));
}

// ── Accordion ─────────────────────────────────────
function initAccordions() {
  document.querySelectorAll('.accordion-trigger').forEach(trigger => {
    trigger.addEventListener('click', () => {
      const item = trigger.closest('.accordion-item');
      const isOpen = item.classList.contains('open');
      document.querySelectorAll('.accordion-item').forEach(i => i.classList.remove('open'));
      if (!isOpen) item.classList.add('open');
    });
  });
}

// ── Mobile Nav Drawer ─────────────────────────────
function openMobileNav() {
  document.querySelector('.mobile-nav-overlay')?.classList.add('open');
  document.querySelector('.mobile-nav-drawer')?.classList.add('open');
  document.body.style.overflow = 'hidden';
}

function closeMobileNav() {
  document.querySelector('.mobile-nav-overlay')?.classList.remove('open');
  document.querySelector('.mobile-nav-drawer')?.classList.remove('open');
  document.body.style.overflow = '';
}

function initMobileNav() {
  // If nav.js is loaded, it handles its own events — skip legacy init
  if (document.querySelector('.mobile-nav-panel')) return;

  // Legacy: Open / close
  document.querySelector('[data-action="open-mobile-nav"]')?.addEventListener('click', openMobileNav);
  document.querySelector('.mobile-nav-close')?.addEventListener('click', closeMobileNav);
  document.querySelector('.mobile-nav-overlay')?.addEventListener('click', closeMobileNav);

  // Legacy: Accordion expand/collapse for sub-links
  document.querySelectorAll('.mobile-nav-expand').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      const item = btn.closest('.mobile-nav-item');
      const isOpen = item.classList.contains('open');
      document.querySelectorAll('.mobile-nav-item').forEach(i => i.classList.remove('open'));
      if (!isOpen) item.classList.add('open');
    });
  });
}

// ── Size Guide Modal ──────────────────────────────
function openSizeGuide() {
  document.getElementById('sizeGuideOverlay')?.classList.add('open');
  document.body.style.overflow = 'hidden';
}

function closeSizeGuide() {
  document.getElementById('sizeGuideOverlay')?.classList.remove('open');
  document.body.style.overflow = '';
}

function initSizeGuide() {
  const overlay = document.getElementById('sizeGuideOverlay');
  if (!overlay) return;

  // Open trigger
  document.querySelector('.size-guide-link')?.addEventListener('click', openSizeGuide);

  // Close button
  overlay.querySelector('.sg-close')?.addEventListener('click', closeSizeGuide);

  // Click outside modal to close
  overlay.addEventListener('click', (e) => {
    if (e.target === overlay) closeSizeGuide();
  });

  // Tab switching
  overlay.querySelectorAll('.sg-tab').forEach(tab => {
    tab.addEventListener('click', () => {
      const target = tab.dataset.sgTab;
      overlay.querySelectorAll('.sg-tab').forEach(t => t.classList.remove('active'));
      overlay.querySelectorAll('.sg-panel').forEach(p => p.classList.remove('active'));
      tab.classList.add('active');
      overlay.querySelector(`[data-sg-panel="${target}"]`)?.classList.add('active');
    });
  });
}

// ── Keyboard shortcuts ────────────────────────────
document.addEventListener('keydown', e => {
  if (e.key === 'Escape') {
    closeCart();
    closeSearch();
    closeMobileNav();
    closeSizeGuide();
  }
});

// ── Recently Viewed ──────────────────────────────────
function trackRecentlyViewed(product) {
  let rv = JSON.parse(localStorage.getItem('gucciRecentlyViewed') || '[]');
  rv = rv.filter(p => p.id !== product.id);
  rv.unshift(product);
  if (rv.length > 12) rv = rv.slice(0, 12);
  localStorage.setItem('gucciRecentlyViewed', JSON.stringify(rv));
}

function renderRecentlyViewed() {
  const grid = document.getElementById('recentlyViewedGrid');
  if (!grid) return;
  const rv = JSON.parse(localStorage.getItem('gucciRecentlyViewed') || '[]');
  const section = grid.closest('.recently-viewed');
  if (rv.length === 0) {
    if (section) section.style.display = 'none';
    return;
  }
  if (section) section.style.display = '';
  grid.innerHTML = rv.slice(0, 6).map(p => `
    <a href="product.html?id=${p.id}" class="rv-card">
      <div class="rv-card-image">
        <img src="${p.image}" alt="${p.name}" loading="lazy" width="300" height="400">
      </div>
      <p class="rv-card-name">${p.name}</p>
      <p class="rv-card-price">₹${p.price.toLocaleString('en-IN')}</p>
    </a>
  `).join('');
}

// ── Wishlist Page ────────────────────────────────────
// wishlistProducts is now built dynamically from PRODUCTS (see rendering engine above)

function renderWishlistPage() {
  const grid = document.getElementById('wishlistGrid');
  const emptyEl = document.getElementById('wishlistEmpty');
  const countEl = document.getElementById('wishlistCount');
  if (!grid) return;

  if (countEl) countEl.textContent = state.wishlist.length;

  if (state.wishlist.length === 0) {
    grid.innerHTML = '';
    if (emptyEl) emptyEl.style.display = '';
    return;
  }

  if (emptyEl) emptyEl.style.display = 'none';

  grid.innerHTML = state.wishlist.map(id => {
    const p = wishlistProducts[id];
    if (!p) return '';
    return `
      <div class="wishlist-card">
        <div class="wishlist-card-image">
          <a href="product.html?id=${id}">
            <img src="${p.image}" alt="${p.name}" loading="lazy" width="600" height="800">
          </a>
          <button class="wishlist-card-remove" onclick="removeFromWishlistPage('${id}')" aria-label="Remove">
            <svg viewBox="0 0 24 24"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
          </button>
        </div>
        <div class="wishlist-card-info">
          <h3><a href="product.html?id=${id}">${p.name}</a></h3>
          <p class="wishlist-card-price">₹${p.price.toLocaleString('en-IN')}</p>
          <button class="btn-add-bag" onclick="addToCart({id:'${id}',name:'${p.name.replace(/'/g, "\\'")}',price:${p.price},image:'${p.image.replace('w=600', 'w=200')}',size:'One Size',color:'${p.color}'})">Add to Bag</button>
        </div>
      </div>
    `;
  }).join('');
}

function removeFromWishlistPage(id) {
  const idx = state.wishlist.indexOf(id);
  if (idx !== -1) state.wishlist.splice(idx, 1);
  saveState();
  renderWishlistPage();
  showToast('Removed from Wishlist');
}

// ── Cookie Consent ───────────────────────────────────
function initCookieBanner() {
  if (localStorage.getItem('gucciCookieConsent')) return;
  const banner = document.querySelector('.cookie-banner');
  if (!banner) return;
  setTimeout(() => banner.classList.add('visible'), 1500);

  banner.querySelector('.btn-accept')?.addEventListener('click', () => {
    localStorage.setItem('gucciCookieConsent', 'accepted');
    banner.classList.remove('visible');
  });
  banner.querySelector('.btn-settings-cookie')?.addEventListener('click', () => {
    localStorage.setItem('gucciCookieConsent', 'minimal');
    banner.classList.remove('visible');
  });
}

// ── Back to Top ──────────────────────────────────────
function initBackToTop() {
  const btn = document.querySelector('.back-to-top');
  if (!btn) return;
  window.addEventListener('scroll', () => {
    btn.classList.toggle('visible', window.scrollY > 600);
  }, { passive: true });
  btn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
}

// ── Checkout redirect ────────────────────────────────
function initCheckoutBtn() {
  document.querySelector('.btn-checkout')?.addEventListener('click', () => {
    if (state.cart.length > 0) {
      window.location.href = 'checkout.html';
    } else {
      showToast('Your bag is empty');
    }
  });
}

// ── Header Scroll Behavior ───────────────────────
function initHeaderScroll() {
  const header = document.querySelector('.site-header--transparent');
  if (!header) return;

  let ticking = false;
  window.addEventListener('scroll', () => {
    if (!ticking) {
      window.requestAnimationFrame(() => {
        if (window.scrollY > 80) {
          header.classList.add('site-header--solid');
        } else {
          header.classList.remove('site-header--solid');
        }
        ticking = false;
      });
      ticking = true;
    }
  }, { passive: true });
}

// ── Footer Accordion ─────────────────────────────
function initFooterAccordion() {
  document.querySelectorAll('.footer-accordion-trigger').forEach(trigger => {
    trigger.addEventListener('click', () => {
      const item = trigger.closest('.footer-accordion-item');
      const isOpen = item.classList.contains('open');
      const expanded = trigger.getAttribute('aria-expanded') === 'true';

      // Close all
      document.querySelectorAll('.footer-accordion-item').forEach(i => {
        i.classList.remove('open');
        const content = i.querySelector('.footer-accordion-content');
        if (content) content.style.maxHeight = '0';
        const trig = i.querySelector('.footer-accordion-trigger');
        if (trig) trig.setAttribute('aria-expanded', 'false');
      });

      // Open clicked if it was closed
      if (!isOpen) {
        item.classList.add('open');
        const content = item.querySelector('.footer-accordion-content');
        if (content) content.style.maxHeight = content.scrollHeight + 'px';
        trigger.setAttribute('aria-expanded', 'true');
      }
    });
  });

  // Open the first accordion item by default
  const firstItem = document.querySelector('.footer-accordion-item');
  if (firstItem) {
    firstItem.classList.add('open');
    const content = firstItem.querySelector('.footer-accordion-content');
    if (content) content.style.maxHeight = content.scrollHeight + 'px';
    const trig = firstItem.querySelector('.footer-accordion-trigger');
    if (trig) trig.setAttribute('aria-expanded', 'true');
  }
}

// ── Smooth Scroll for Hero Indicator ─────────────
function initHeroScroll() {
  const indicator = document.querySelector('.hero-scroll-indicator');
  if (!indicator) return;
  indicator.addEventListener('click', () => {
    const hero = document.querySelector('.hero');
    if (hero) {
      const nextSection = hero.nextElementSibling;
      if (nextSection) {
        nextSection.scrollIntoView({ behavior: 'smooth' });
      }
    }
  });
  indicator.style.cursor = 'pointer';
}

// ── Init ──────────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
  renderCart();
  updateCartBadge();
  initReveal();
  initAccordions();
  initMobileNav();
  initSearch();
  initSizeGuide();
  initCookieBanner();
  initBackToTop();
  initCheckoutBtn();
  renderRecentlyViewed();
  renderWishlistPage();
  initHeaderScroll();
  initFooterAccordion();
  initHeroScroll();

  // Cart events
  document.querySelector('[data-action="open-cart"]')?.addEventListener('click', openCart);
  document.querySelector('.cart-overlay')?.addEventListener('click', closeCart);
  document.querySelector('.cart-close')?.addEventListener('click', closeCart);

  // Search events
  document.querySelector('[data-action="open-search"]')?.addEventListener('click', openSearch);
  document.querySelector('.search-close')?.addEventListener('click', closeSearch);

  // Toast close
  document.querySelector('.toast-close')?.addEventListener('click', () => {
    document.querySelector('.toast')?.classList.remove('show');
  });

  // Mark wishlist items
  document.querySelectorAll('.wishlist-btn').forEach(btn => {
    const id = btn.dataset.id;
    if (state.wishlist.includes(id)) btn.classList.add('active');
  });

  // Track product view on product page
  const productMain = document.querySelector('.product-layout');
  if (productMain) {
    const name = document.querySelector('.product-title')?.textContent || '';
    const price = parseInt(document.querySelector('.product-price')?.textContent?.replace(/[^0-9]/g, '') || '0');
    const image = document.querySelector('.gallery-main img')?.src || '';
    const params = new URLSearchParams(window.location.search);
    const id = params.get('id') || 'prod-001';
    if (name) trackRecentlyViewed({ id, name, price, image: image.replace(/w=\d+/, 'w=300') });
  }
});
