// Product definitions and artwork.
const products = [
  { name: "Instant Noodles", price: 18, art: '<path d="M12 27h40l-6 27H18z" fill="#d9a24b"/><path d="M10 27h44M18 35h28" stroke="#886b36"/><path d="M23 20c-5-5 5-5 0-11M33 20c-5-5 5-5 0-11M43 20c-5-5 5-5 0-11" stroke="#b5ba95"/><path d="M24 42h16" stroke="#fff5d6" stroke-width="4"/>' },
  { name: "Potato Chips", price: 25, art: '<path d="M18 9h29l-3 12 3 34H18l3-34z" fill="#e5b967"/><path d="M19 13h27M19 51h27" stroke="#a67b36"/><ellipse cx="32" cy="33" rx="9" ry="11" fill="#fff0b9"/><path d="M29 28l6 10M33 27l5 9" stroke="#d5aa50"/>' },
  { name: "Soft Drink (Can)", price: 25, art: '<rect x="21" y="12" width="25" height="43" rx="5" fill="#be7863"/><ellipse cx="33.5" cy="12" rx="12.5" ry="4" fill="#d8dedb"/><path d="M29 12h8" stroke="#879a92"/><path d="M22 37l23-13v10L22 47z" fill="#f8e9dd"/>' },
  { name: "Bottled Water", price: 20, art: '<rect x="28" y="7" width="12" height="7" rx="2" fill="#659aaf"/><path d="M28 14h12v6l6 8v25q0 5-5 5H27q-5 0-5-5V28l6-8z" fill="#cee7ed" stroke="#91b9c5"/><path d="M22 32h24v14H22" fill="#78a7b6"/><path d="M28 38h12M28 50v3" stroke="#f1fcff" stroke-width="3"/>' },
  { name: "Ballpen (piece)", price: 12, art: '<g transform="rotate(35 32 32)"><path d="M29 14h8v34h-8z" fill="#727da2"/><path d="M29 48h8l-4 10z" fill="#b4bacb"/><path d="M33 58v3" stroke="#4e587a"/><rect x="28" y="6" width="10" height="19" rx="3" fill="#434f74"/><path d="M39 10v15" stroke="#8993b2" stroke-width="3"/></g>' },
  { name: "Notebook (piece)", price: 35, art: '<rect x="17" y="10" width="34" height="46" rx="3" fill="#73a084"/><path d="M24 10v46" stroke="#456d54" stroke-width="2"/><rect x="30" y="22" width="15" height="13" rx="1" fill="#eaf2e7"/><path d="M33 27h9M33 31h7" stroke="#a3baaa"/><path d="M14 17h8M14 25h8M14 33h8M14 41h8M14 49h8" stroke="#a6b5a6" stroke-width="2"/>' }
];

const priceFormatter = new Intl.NumberFormat("en-PH", {
  style: "currency",
  currency: "PHP"
});

const productGrid = document.getElementById("product-grid");

products.forEach((product, productId) => {
  const card = document.createElement("article");
  card.className = "product-card";

  // Decorative SVG artwork uses only the trusted, local product definitions.
  const artwork = document.createElement("div");
  artwork.className = "product-art";
  artwork.innerHTML = `<svg viewBox="0 0 64 64" fill="none" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${product.art}</svg>`;

  const name = document.createElement("h3");
  name.textContent = product.name;

  const price = document.createElement("p");
  price.className = "price";
  price.textContent = priceFormatter.format(product.price);

  const button = document.createElement("button");
  button.type = "button";
  button.className = "add-button";
  button.innerHTML = '<span aria-hidden="true">+</span> Add to Cart';
  button.setAttribute("aria-label", `Add ${product.name} to cart`);
  button.addEventListener("click", () => addToCart(productId));

  card.append(artwork, name, price, button);
  productGrid.append(card);
});

// One Map entry per product prevents duplicate rows. Values are quantities.
// Cart contents are kept in memory and reset when the page is reloaded.
const cart = new Map();
const cartItems = document.getElementById("cart-items");
const emptyOrder = document.getElementById("empty-order");
const itemCount = document.getElementById("item-count");
const orderSubtotal = document.getElementById("order-subtotal");
const orderTotal = document.getElementById("order-total");
const paymentForm = document.getElementById("payment-form");
const cashInput = document.getElementById("cash-amount");
const paymentMessage = document.getElementById("payment-message");
const paymentChange = document.getElementById("payment-change");
const paymentConfirmation = document.getElementById("payment-confirmation");

// The cart and payment share one calculation, using integer centavos.
function getTotalCentavos() {
  let total = 0;
  cart.forEach((quantity, productId) => {
    total += Math.round(products[productId].price * 100) * quantity;
  });
  return total;
}

// Editing the order or cash invalidates the previous payment confirmation.
function resetPayment() {
  paymentConfirmation.hidden = true;
  paymentMessage.textContent = "";
  paymentMessage.className = "payment-message";
  paymentChange.textContent = priceFormatter.format(0);
  cashInput.setAttribute("aria-invalid", "false");
}

function showPaymentError(message, invalidCash = false) {
  paymentMessage.textContent = message;
  paymentMessage.className = "payment-message payment-error";
  cashInput.setAttribute("aria-invalid", String(invalidCash));
}

// Validate before confirming: order, numeric input, nonnegative cash, precision,
// and enough money. No receipt is generated and the order remains visible.
function confirmPayment(event) {
  event.preventDefault();
  resetPayment();
  if (cart.size === 0) {
    showPaymentError("Your cart is empty. Add a product before paying.");
    return;
  }
  const rawAmount = cashInput.value.trim();
  if (cashInput.validity.badInput) {
    showPaymentError("Enter a valid numeric cash amount.", true);
    return;
  }
  if (rawAmount === "") {
    showPaymentError("Enter the cash amount received.", true);
    return;
  }
  const amount = Number(rawAmount);
  if (!Number.isFinite(amount)) {
    showPaymentError("Enter a valid numeric cash amount.", true);
    return;
  }
  if (amount < 0) {
    showPaymentError("Cash amount cannot be negative.", true);
    return;
  }
  if (!/^(?:\d+(?:\.\d{0,2})?|\.\d{1,2})$/.test(rawAmount)) {
    showPaymentError("Enter a cash amount with up to two decimal places.", true);
    return;
  }
  const paidCentavos = Math.round(amount * 100);
  if (!Number.isSafeInteger(paidCentavos)) {
    showPaymentError("Cash amount is too large. Enter a smaller amount.", true);
    return;
  }
  const totalCentavos = getTotalCentavos();
  if (paidCentavos < totalCentavos) {
    showPaymentError(`Insufficient cash. The total is ${priceFormatter.format(totalCentavos / 100)}.`, true);
    return;
  }
  const change = priceFormatter.format((paidCentavos - totalCentavos) / 100);
  paymentChange.textContent = change;
  document.getElementById("confirmed-total").textContent = priceFormatter.format(totalCentavos / 100);
  document.getElementById("confirmed-paid").textContent = priceFormatter.format(paidCentavos / 100);
  document.getElementById("confirmed-change").textContent = change;
  paymentConfirmation.hidden = false;
  paymentMessage.textContent = "Cash payment confirmed successfully.";
  paymentMessage.className = "payment-message payment-success";
}

paymentForm.addEventListener("submit", confirmPayment);
cashInput.addEventListener("input", resetPayment);

// Adding an existing product increases its quantity instead of adding a row.
function addToCart(productId) {
  if (!products[productId]) return;
  cart.set(productId, (cart.get(productId) || 0) + 1);
  renderCart();
}

// Quantities stay at one or above. Use Remove to delete the last unit.
function changeQuantity(productId, change) {
  if (!cart.has(productId) || (change !== 1 && change !== -1)) return;
  cart.set(productId, Math.max(1, cart.get(productId) + change));
  renderCart();
}

function removeFromCart(productId) {
  cart.delete(productId);
  renderCart();
}

// Build accessible controls with descriptive names for each product.
function createCartButton(label, action, productId, accessibleLabel) {
  const button = document.createElement("button");
  button.type = "button";
  button.className = action === "remove" ? "remove-button" : "quantity-button";
  button.textContent = label;
  button.dataset.action = action;
  button.dataset.productId = productId;
  button.setAttribute("aria-label", accessibleLabel);
  return button;
}

// Rebuild the summary from cart state and calculate totals in integer centavos.
function renderCart() {
  resetPayment();
  const focusedButton = cartItems.contains(document.activeElement)
    ? document.activeElement : null;
  const focusedId = focusedButton?.dataset.productId;
  const focusedAction = focusedButton?.dataset.action;
  cartItems.replaceChildren();
  const totalCentavos = getTotalCentavos();
  let totalQuantity = 0;

  cart.forEach((quantity, productId) => {
    const product = products[productId];
    const subtotalCentavos = Math.round(product.price * 100) * quantity;
    totalQuantity += quantity;

    const row = document.createElement("li");
    row.className = "cart-item";
    const name = document.createElement("h3");
    name.textContent = product.name;
    const unitPrice = document.createElement("p");
    unitPrice.className = "unit-price";
    unitPrice.textContent = `${priceFormatter.format(product.price)} each`;
    const controls = document.createElement("div");
    controls.className = "cart-controls";
    const quantityControls = document.createElement("div");
    quantityControls.className = "quantity-controls";
    const decrease = createCartButton("−", "decrease", productId, `Decrease ${product.name} quantity`);
    decrease.disabled = quantity === 1;
    const quantityLabel = document.createElement("span");
    quantityLabel.textContent = quantity;
    quantityLabel.setAttribute("aria-label", `Quantity: ${quantity}`);
    const increase = createCartButton("+", "increase", productId, `Increase ${product.name} quantity`);
    quantityControls.append(decrease, quantityLabel, increase);
    const subtotal = document.createElement("strong");
    subtotal.className = "item-subtotal";
    subtotal.textContent = priceFormatter.format(subtotalCentavos / 100);
    subtotal.setAttribute("aria-label", `Item subtotal: ${subtotal.textContent}`);
    controls.append(quantityControls, subtotal);
    const remove = createCartButton("Remove", "remove", productId, `Remove ${product.name} from cart`);
    row.append(name, unitPrice, controls, remove);
    cartItems.append(row);
  });

  emptyOrder.hidden = cart.size > 0;
  cartItems.hidden = cart.size === 0;
  itemCount.textContent = `${totalQuantity} ${totalQuantity === 1 ? "item" : "items"}`;
  orderSubtotal.textContent = priceFormatter.format(totalCentavos / 100);
  orderTotal.textContent = priceFormatter.format(totalCentavos / 100);

  // Keep keyboard focus usable after rows are rebuilt or removed.
  if (focusedButton) {
    const replacement = cartItems.querySelector(`[data-product-id="${focusedId}"][data-action="${focusedAction}"]`);
    const fallback = cartItems.querySelector(`[data-product-id="${focusedId}"][data-action="increase"]`)
      || cartItems.querySelector("button:not(:disabled)")
      || productGrid.querySelector("button");
    (replacement && !replacement.disabled ? replacement : fallback)?.focus();
  }
}

// Delegation keeps the controls working after the summary is re-rendered.
cartItems.addEventListener("click", (event) => {
  const button = event.target.closest("button[data-action]");
  if (!button || !cartItems.contains(button) || button.disabled) return;
  const productId = Number(button.dataset.productId);
  if (button.dataset.action === "remove") removeFromCart(productId);
  else if (button.dataset.action === "increase") changeQuantity(productId, 1);
  else if (button.dataset.action === "decrease") changeQuantity(productId, -1);
});

renderCart();
