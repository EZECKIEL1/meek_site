/* ============================================================
   MËËK — Panier (localStorage) + Commande via WhatsApp
   ============================================================
   IMPORTANT : remplace WHATSAPP_NUMBER ci-dessous par le vrai
   numéro WhatsApp Business de MËËK, au format international
   SANS le "+" ni espaces (ex : "22990000000").
   ============================================================ */
const WHATSAPP_NUMBER = "2290190724866";

const CART_KEY = "meek_cart";

function formatFCFA(amount) {
  return amount.toLocaleString("fr-FR").replace(/,/g, " ") + " FCFA";
}

function getCart() {
  try {
    const raw = localStorage.getItem(CART_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch (e) {
    return [];
  }
}

function saveCart(cart) {
  localStorage.setItem(CART_KEY, JSON.stringify(cart));
  renderCart();
}

function addToCart(id, name, price) {
  const cart = getCart();
  const existing = cart.find((item) => item.id === id);
  if (existing) {
    existing.qty += 1;
  } else {
    cart.push({ id, name, price, qty: 1 });
  }
  saveCart(cart);
  openCart();
}

function changeQty(id, delta) {
  let cart = getCart();
  const item = cart.find((i) => i.id === id);
  if (!item) return;
  item.qty += delta;
  if (item.qty <= 0) {
    cart = cart.filter((i) => i.id !== id);
  }
  saveCart(cart);
}

function removeFromCart(id) {
  const cart = getCart().filter((i) => i.id !== id);
  saveCart(cart);
}

function cartTotal(cart) {
  return cart.reduce((sum, item) => sum + item.price * item.qty, 0);
}

function cartCount(cart) {
  return cart.reduce((sum, item) => sum + item.qty, 0);
}

function renderCart() {
  const cart = getCart();
  const itemsEl = document.getElementById("cartItems");
  const countEl = document.getElementById("cartCount");
  const totalEl = document.getElementById("cartTotalValue");
  const whatsappBtn = document.getElementById("cartWhatsappBtn");
  if (!itemsEl) return;

  const count = cartCount(cart);
  countEl.textContent = count;
  countEl.dataset.empty = count === 0 ? "true" : "false";

  if (cart.length === 0) {
    itemsEl.innerHTML = '<p class="cart-empty">Votre panier est vide.</p>';
  } else {
    itemsEl.innerHTML = cart
      .map(
        (item) => `
        <div class="cart-item">
          <div>
            <div class="cart-item-name">${escapeHTML(item.name)}</div>
            <div class="cart-item-price">${formatFCFA(item.price)}</div>
            <div class="cart-qty">
              <button class="qty-btn" data-action="dec" data-id="${item.id}" aria-label="Diminuer la quantité">−</button>
              <span class="qty-value">${item.qty}</span>
              <button class="qty-btn" data-action="inc" data-id="${item.id}" aria-label="Augmenter la quantité">+</button>
            </div>
          </div>
          <button class="cart-item-remove" data-action="remove" data-id="${item.id}" aria-label="Retirer l'article">×</button>
        </div>`
      )
      .join("");
  }

  const total = cartTotal(cart);
  totalEl.textContent = formatFCFA(total);

  if (cart.length === 0) {
    whatsappBtn.setAttribute("aria-disabled", "true");
    whatsappBtn.classList.add("disabled");
    whatsappBtn.style.pointerEvents = "none";
    whatsappBtn.style.opacity = "0.4";
    whatsappBtn.removeAttribute("href");
  } else {
    whatsappBtn.classList.remove("disabled");
    whatsappBtn.style.pointerEvents = "auto";
    whatsappBtn.style.opacity = "1";
    whatsappBtn.setAttribute("href", buildWhatsappLink(cart, total));
  }
}

function buildWhatsappLink(cart, total) {
  let message = "Bonjour MËËK, je souhaite passer la commande suivante :\n\n";
  cart.forEach((item) => {
    message += `• ${item.name} x${item.qty} — ${formatFCFA(item.price * item.qty)}\n`;
  });
  message += `\nTotal : ${formatFCFA(total)}\n\nMerci de me confirmer la disponibilité et les modalités de livraison.`;
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
}

function escapeHTML(str) {
  const div = document.createElement("div");
  div.textContent = str;
  return div.innerHTML;
}

function openCart() {
  document.getElementById("cartDrawer").classList.add("open");
  document.getElementById("cartOverlay").classList.add("open");
}

function closeCart() {
  document.getElementById("cartDrawer").classList.remove("open");
  document.getElementById("cartOverlay").classList.remove("open");
}

document.addEventListener("DOMContentLoaded", () => {
  renderCart();

  document.querySelectorAll("[data-add-to-cart]").forEach((btn) => {
    btn.addEventListener("click", (e) => {
      e.preventDefault();
      const { id, name, price } = btn.dataset;
      addToCart(id, name, Number(price));
    });
  });

  const cartBtn = document.getElementById("cartToggle");
  if (cartBtn) cartBtn.addEventListener("click", openCart);

  const closeBtn = document.getElementById("cartClose");
  if (closeBtn) closeBtn.addEventListener("click", closeCart);

  const overlay = document.getElementById("cartOverlay");
  if (overlay) overlay.addEventListener("click", closeCart);

  const itemsEl = document.getElementById("cartItems");
  if (itemsEl) {
    itemsEl.addEventListener("click", (e) => {
      const target = e.target.closest("button[data-action]");
      if (!target) return;
      const { action, id } = target.dataset;
      if (action === "inc") changeQty(id, 1);
      if (action === "dec") changeQty(id, -1);
      if (action === "remove") removeFromCart(id);
    });
  }
});
