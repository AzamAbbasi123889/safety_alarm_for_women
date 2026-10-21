/* DaisyDing static storefront.
 * Add a PayPal hosted invoice/checkout URL for each bundle size before launch.
 * This page does not collect name, email, phone, or address details.
 */
const PAYPAL_CHECKOUT_URLS = {
  1: "https://www.paypal.com/ncp/payment/NHVNH4DAANLZG", // $39.99 — 1 pack
  2: "https://www.paypal.com/ncp/payment/32BFMGAF328X2", // $71.98 — 2 pack
  3: "https://www.paypal.com/ncp/payment/QFSWZ9DV2NE8N"  // $101.97 — 3 pack
};
const PRODUCT = {
  id: "daisyding-personal-safety-alarm",
  name: "Personal Safety Alarm",
  image: "assets/supplier-product.jpg",
  bundles: {
    1: { label: "1 pack", price: 39.99, units: 1 },
    2: { label: "2 pack", price: 71.98, units: 2 },
    3: { label: "3 pack", price: 101.97, units: 3 }
  }
};
const $ = (selector, scope = document) => scope.querySelector(selector);
const $$ = (selector, scope = document) => [...scope.querySelectorAll(selector)];
let selectedBundle = 1;
let cart = [];
let toastTimer;
const fmt = value => new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(value);
try {
  const saved = localStorage.getItem("daisyding_cart_v2");
  if (saved) cart = JSON.parse(saved);
  if (!Array.isArray(cart)) cart = [];
} catch (_) { cart = []; }

$("#year").textContent = new Date().getFullYear();
function showToast(message) {
  const toast = $("#toast");
  toast.textContent = message;
  toast.classList.add("is-visible");
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => toast.classList.remove("is-visible"), 4200);
}
function cartQuantity() { return cart.reduce((sum, item) => sum + item.quantity, 0); }
function subtotal() { return cart.reduce((sum, item) => sum + item.quantity * item.price, 0); }
function saveCart() {
  try { localStorage.setItem("daisyding_cart_v2", JSON.stringify(cart)); } catch (_) { /* cart remains usable for this session */ }
  renderCart();
}
function selectBundle(size) {
  if (!PRODUCT.bundles[size]) return;
  selectedBundle = size;
  $$(".bundle-card").forEach(card => {
    const active = Number(card.dataset.bundle) === selectedBundle;
    card.classList.toggle("is-selected", active);
    card.setAttribute("aria-checked", String(active));
  });
  $("#selectedBundleLabel").textContent = PRODUCT.bundles[size].label;
  $("#displayPrice").textContent = fmt(PRODUCT.bundles[size].price);
}
function addSelectedBundle(openDrawer = true) {
  const pack = PRODUCT.bundles[selectedBundle];
  const key = `${PRODUCT.id}:bundle-${selectedBundle}`;
  const existing = cart.find(item => item.key === key);
  if (existing) existing.quantity += 1;
  else cart.push({
    key,
    id: PRODUCT.id,
    name: PRODUCT.name,
    bundleSize: selectedBundle,
    label: pack.label,
    units: pack.units,
    price: pack.price,
    image: PRODUCT.image,
    quantity: 1
  });
  saveCart();
  showToast(`${pack.label} added to your bag.`);
  if (openDrawer) openCart();
}
function renderCart() {
  $("#cartCount").textContent = cartQuantity();
  $("#drawerCount").textContent = `(${cartQuantity()})`;
  $("#cartSubtotal").textContent = fmt(subtotal());
  const content = $("#cartContent");
  const footer = $("#cartFooter");
  if (!cart.length) {
    content.innerHTML = `<div class="empty-bag"><span class="empty-flower">✿</span><h3>Your bag is looking cute and empty.</h3><p>Choose a bundle to get started.</p><button class="button button-dark" id="continueShopping">Continue shopping</button></div>`;
    footer.hidden = true;
    $("#continueShopping").addEventListener("click", closeCart);
    return;
  }
  footer.hidden = false;
  content.innerHTML = cart.map((item, index) => `
    <article class="cart-item">
      <img src="${item.image}" alt="Personal safety alarm product image">
      <div>
        <h3>${escapeHTML(item.name)}</h3>
        <div class="cart-color">Bundle: ${escapeHTML(item.label)} · ${item.units} alarm${item.units === 1 ? "" : "s"}</div>
        <div class="cart-item-price">${fmt(item.price)} per bundle</div>
        <div class="cart-item-controls">
          <button type="button" data-cart-action="minus" data-index="${index}" aria-label="Decrease ${escapeHTML(item.label)} quantity">−</button>
          <span>${item.quantity}</span>
          <button type="button" data-cart-action="plus" data-index="${index}" aria-label="Increase ${escapeHTML(item.label)} quantity">+</button>
          <button type="button" class="remove-item" data-cart-action="remove" data-index="${index}">Remove</button>
        </div>
      </div>
    </article>`).join("");
  $$('[data-cart-action]', content).forEach(button => button.addEventListener("click", () => {
    const index = Number(button.dataset.index);
    const action = button.dataset.cartAction;
    if (!cart[index]) return;
    if (action === "plus") cart[index].quantity += 1;
    if (action === "minus") cart[index].quantity -= 1;
    if (action === "remove" || cart[index].quantity <= 0) cart.splice(index, 1);
    saveCart();
  }));
}
function escapeHTML(value) {
  return String(value).replace(/[&<>"']/g, char => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[char]);
}
function openCart() {
  $("#cartOverlay").hidden = false;
  requestAnimationFrame(() => $("#cartOverlay").classList.add("is-visible"));
  $("#cartDrawer").classList.add("is-open");
  $("#cartDrawer").setAttribute("aria-hidden", "false");
  document.body.classList.add("drawer-open");
  $("#closeCart").focus();
}
function closeCart() {
  $("#cartOverlay").classList.remove("is-visible");
  $("#cartDrawer").classList.remove("is-open");
  $("#cartDrawer").setAttribute("aria-hidden", "true");
  document.body.classList.remove("drawer-open");
  setTimeout(() => { if (!$("#cartOverlay").classList.contains("is-visible")) $("#cartOverlay").hidden = true; }, 280);
}
function checkout() {
  if (!cart.length) {
    showToast("Your bag is empty. Choose a bundle first.");
    return;
  }
  if (cart.length !== 1 || cart[0].quantity !== 1) {
    showToast("This checkout needs one bundle per payment. Remove other bundles or quantities, or configure a PayPal invoice for the combined total.");
    return;
  }
  const item = cart[0];
  const checkoutUrl = PAYPAL_CHECKOUT_URLS[item.bundleSize];
  if (!checkoutUrl || !/^https:\/\//i.test(checkoutUrl)) {
    showToast(`Add the PayPal invoice URL for the ${item.label} ($${item.price.toFixed(2)}) in script.js before checkout.`);
    return;
  }
  window.location.assign(checkoutUrl);
}

$$(".bundle-card").forEach(button => button.addEventListener("click", () => selectBundle(Number(button.dataset.bundle))));
$$(".thumbnail").forEach(button => button.addEventListener("click", () => {
  $$(".thumbnail").forEach(item => item.classList.remove("is-active"));
  button.classList.add("is-active");
  $("#mainProductImage").src = button.dataset.image;
  $("#mainProductImage").alt = button.dataset.alt;
}));
$("#addToCart").addEventListener("click", () => addSelectedBundle(true));
$("#buyNow").addEventListener("click", () => {
  cart = [{
    key: `${PRODUCT.id}:bundle-${selectedBundle}`,
    id: PRODUCT.id,
    name: PRODUCT.name,
    bundleSize: selectedBundle,
    label: PRODUCT.bundles[selectedBundle].label,
    units: PRODUCT.bundles[selectedBundle].units,
    price: PRODUCT.bundles[selectedBundle].price,
    image: PRODUCT.image,
    quantity: 1
  }];
  saveCart();
  openCart();
  setTimeout(checkout, 140);
});
$("#openCart").addEventListener("click", openCart);
$("#closeCart").addEventListener("click", closeCart);
$("#cartOverlay").addEventListener("click", closeCart);
$("#cartCheckout").addEventListener("click", checkout);
document.addEventListener("keydown", event => { if (event.key === "Escape") { closeCart(); closeLightbox(); closeMobileMenu(); } });

const mobileMenu = $("#mobileMenu");
function closeMobileMenu() { mobileMenu.classList.remove("is-open"); mobileMenu.setAttribute("aria-hidden", "true"); $("#menuButton").setAttribute("aria-expanded", "false"); }
$("#menuButton").addEventListener("click", () => {
  const isOpen = mobileMenu.classList.toggle("is-open");
  mobileMenu.setAttribute("aria-hidden", String(!isOpen));
  $("#menuButton").setAttribute("aria-expanded", String(isOpen));
});
$$("#mobileMenu a").forEach(link => link.addEventListener("click", closeMobileMenu));

function openLightbox() {
  $("#lightboxImage").src = $("#mainProductImage").src;
  $("#lightboxImage").alt = $("#mainProductImage").alt;
  $("#lightbox").classList.add("is-open");
  $("#lightbox").setAttribute("aria-hidden", "false");
}
function closeLightbox() { $("#lightbox").classList.remove("is-open"); $("#lightbox").setAttribute("aria-hidden", "true"); }
$("#zoomImage").addEventListener("click", openLightbox);
$("#mainProductImage").addEventListener("click", openLightbox);
$("#closeLightbox").addEventListener("click", closeLightbox);
$("#lightbox").addEventListener("click", event => { if (event.target === $("#lightbox")) closeLightbox(); });
renderCart();
