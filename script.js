// Product definitions and locally stored photographs.
const products = [
  { name: "Instant Noodles", price: 18, image: "assets/products/instant-noodles.jpg", alt: "Lucky Me chicken-flavoured instant noodle packet", credit: "Product photo: Tradewinds Oriental Shop", source: "https://tradewindsorientalshop.co.uk/products/lucky-me-chicken-flavour-instant-noodles-55g" },
  { name: "Potato Chips", price: 25, image: "assets/products/potato-chips.jpg", alt: "Jack 'n Jill Piattos cheese potato crisps bag", credit: "Product photo: Citimart", source: "https://www.citimartdelivery.com.ph/products/1087424" },
  { name: "Soft Drink (Can)", price: 25, image: "assets/products/soft-drink.jpg", alt: "Red Coca-Cola soft drink can", credit: "Product photo: AlaMesa", source: "https://www.alamesacuba.com/en/la-habana/delivery/details/regular-coca-cola-soda-330-ml/" },
  { name: "Bottled Water", price: 20, image: "assets/products/bottled-water.jpg", alt: "Clear Evian water bottle with a pink cap", credit: "Photo: James Tamim / Wikimedia Commons", source: "https://commons.wikimedia.org/wiki/File:Evian_Label-Free_Bottle.jpg", license: "CC BY-SA 4.0", licenseUrl: "https://creativecommons.org/licenses/by-sa/4.0/" },
  { name: "Ballpen (piece)", price: 12, image: "assets/products/ballpen.jpg", alt: "Blue BIC ballpoint pen and cap", credit: "Photo: Trounce / Wikimedia Commons", source: "https://commons.wikimedia.org/wiki/File:03-BICcristal2008-03-26.jpg", license: "CC BY 3.0", licenseUrl: "https://creativecommons.org/licenses/by/3.0/" },
  { name: "Notebook (piece)", price: 35, image: "assets/products/notebook.png", alt: "Spiral-bound notebook with squared paper", credit: "Photo: Tuffstein / Wikimedia Commons", source: "https://commons.wikimedia.org/wiki/File:Notebook.png", license: "CC BY 3.0", licenseUrl: "https://creativecommons.org/licenses/by/3.0/" }
];

const priceFormatter = new Intl.NumberFormat("en-PH", {
  style: "currency",
  currency: "PHP"
});

// Format integer centavos without converting the fractional pesos to a float.
function formatCentavos(centavos) {
  const wholePesos = Math.floor(centavos / 100);
  const fraction = String(centavos % 100).padStart(2, "0");
  return priceFormatter.formatToParts(wholePesos)
    .map(part => part.type === "fraction" ? fraction : part.value)
    .join("");
}

// Call after decimal validation; combining integer parts avoids penny rounding.
function parseCashCentavos(rawAmount) {
  const [pesos, fraction = ""] = rawAmount.split(".");
  return Number(pesos || "0") * 100 + Number(fraction.padEnd(2, "0"));
}

const productGrid = document.getElementById("product-grid");

products.forEach((product, productId) => {
  const card = document.createElement("article");
  card.className = "product-card";
  card.dataset.productId = productId;

  const artwork = document.createElement("button");
  artwork.type = "button";
  artwork.className = "product-art";
  artwork.setAttribute("aria-label", `View ${product.name} details`);
  artwork.setAttribute("aria-haspopup", "dialog");
  artwork.setAttribute("aria-controls", "product-modal");
  const image = document.createElement("img");
  image.src = product.image;
  image.alt = product.alt;
  image.width = 320;
  image.height = 200;
  image.decoding = "async";
  artwork.append(image);
  artwork.addEventListener("click", () => showProductDetails(productId));

  const name = document.createElement("h3");
  name.textContent = product.name;

  const price = document.createElement("p");
  price.className = "price";
  price.textContent = formatCentavos(Math.round(product.price * 100));

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
const cartTableWrap = document.getElementById("cart-table-wrap");
const emptyOrder = document.getElementById("empty-order");
const itemCount = document.getElementById("item-count");
const orderSubtotal = document.getElementById("order-subtotal");
const orderTotal = document.getElementById("order-total");
const paymentForm = document.getElementById("payment-form");
const cashInput = document.getElementById("cash-amount");
const paymentMessage = document.getElementById("payment-message");
const paymentChange = document.getElementById("payment-change");
const paymentConfirmation = document.getElementById("payment-confirmation");
const confirmButton = paymentForm.querySelector('button[type="submit"]');
const receipt = document.getElementById("receipt");
const receiptItems = document.getElementById("receipt-items");
const receiptFields = ["receipt-reference", "receipt-date", "receipt-total", "receipt-cash", "receipt-change"];
let completedTransaction = null;
let transactionSequence = 0;
let selectedProductId = null;
const productModal = document.getElementById("product-modal");
const receiptModal = document.getElementById("receipt-modal");
const resetModal = document.getElementById("reset-modal");
const viewReceipt = document.getElementById("view-receipt");

// Native dialogs provide focus containment, Escape dismissal, and inert background.
function openModal(dialog) {
  if (!dialog.open) dialog.showModal();
}

[
  [productModal, "close-product"],
  [receiptModal, "close-receipt"],
  [resetModal, "cancel-reset"]
].forEach(([dialog, closeId]) => {
  document.getElementById(closeId).addEventListener("click", () => dialog.close());
  dialog.addEventListener("keydown", event => {
    if (event.key !== "Tab") return;
    const controls = dialog.querySelectorAll('button:not(:disabled), a[href]:not([hidden]), input:not(:disabled)');
    const first = controls[0];
    const last = controls[controls.length - 1];
    if (event.shiftKey && document.activeElement === first) {
      event.preventDefault();
      last.focus();
    } else if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault();
      first.focus();
    }
  });
  dialog.addEventListener("click", event => {
    if (event.target !== dialog) return;
    const bounds = dialog.getBoundingClientRect();
    if (event.clientX < bounds.left || event.clientX > bounds.right ||
        event.clientY < bounds.top || event.clientY > bounds.bottom) dialog.close();
  });
});

function showProductDetails(productId) {
  const product = products[productId];
  selectedProductId = productId;
  document.getElementById("product-modal-title").textContent = product.name;
  const image = document.getElementById("product-modal-image");
  image.src = product.image;
  image.alt = product.alt;
  document.getElementById("product-modal-price").textContent = formatCentavos(Math.round(product.price * 100));
  const source = document.getElementById("product-photo-source");
  source.textContent = product.credit;
  source.href = product.source;
  const license = document.getElementById("product-photo-license");
  license.textContent = product.license || "";
  license.href = product.licenseUrl || product.source;
  license.hidden = !product.license;
  document.getElementById("product-modal-add").disabled = Boolean(completedTransaction);
  openModal(productModal);
}

document.getElementById("product-modal-add").addEventListener("click", () => {
  if (selectedProductId === null || completedTransaction) return;
  addToCart(selectedProductId);
  productModal.close();
});
viewReceipt.addEventListener("click", () => {
  if (completedTransaction) openModal(receiptModal);
});
document.getElementById("confirm-reset").addEventListener("click", resetTransaction);
document.getElementById("receipt-new-transaction").addEventListener("click", resetTransaction);

// Keep the paid order unchanged until the next customer starts a transaction.
function setTransactionLocked(locked) {
  productGrid.querySelectorAll(".add-button").forEach(button => { button.disabled = locked; });
  cartItems.querySelectorAll("button").forEach(button => {
    button.disabled = locked || (button.dataset.action === "decrease" && cart.get(Number(button.dataset.productId)) === 1);
  });
  cashInput.disabled = locked;
  confirmButton.disabled = locked;
}

// Copy the purchased items and amounts so the receipt is a payment snapshot.
function generateReceipt(totalCentavos, paidCentavos) {
  const now = new Date();
  transactionSequence += 1;
  completedTransaction = {
    reference: `CCS-${now.getTime()}-${String(transactionSequence).padStart(4, "0")}`,
    date: now,
    items: Array.from(cart, ([productId, quantity]) => ({
      name: products[productId].name,
      quantity,
      unitCentavos: Math.round(products[productId].price * 100)
    })),
    totalCentavos,
    paidCentavos,
    changeCentavos: paidCentavos - totalCentavos
  };
  receiptItems.replaceChildren();
  completedTransaction.items.forEach(item => {
    const row = document.createElement("tr");
    [item.name, item.quantity, formatCentavos(item.unitCentavos),
      formatCentavos(item.unitCentavos * item.quantity)].forEach(value => {
      const cell = document.createElement("td");
      cell.textContent = value;
      row.append(cell);
    });
    receiptItems.append(row);
  });
  document.getElementById("receipt-reference").textContent = completedTransaction.reference;
  document.getElementById("receipt-date").textContent = new Intl.DateTimeFormat("en-PH", {
    dateStyle: "medium", timeStyle: "short", timeZone: "Asia/Manila"
  }).format(now) + " (Asia/Manila)";
  document.getElementById("receipt-total").textContent = formatCentavos(totalCentavos);
  document.getElementById("receipt-cash").textContent = formatCentavos(paidCentavos);
  document.getElementById("receipt-change").textContent = formatCentavos(completedTransaction.changeCentavos);
  receipt.hidden = false;
  viewReceipt.hidden = false;
  setTransactionLocked(true);
  openModal(receiptModal);
}

// Clear every customer-specific value while keeping the catalog and listeners.
function resetTransaction() {
  [productModal, receiptModal, resetModal].forEach(dialog => {
    if (dialog.open) dialog.close();
  });
  completedTransaction = null;
  cart.clear();
  cashInput.value = "";
  receiptItems.replaceChildren();
  receiptFields.forEach(id => { document.getElementById(id).textContent = ""; });
  receipt.hidden = true;
  viewReceipt.hidden = true;
  cartTableWrap.scrollTop = 0;
  cartTableWrap.scrollLeft = 0;
  setTransactionLocked(false);
  renderCart();
  productGrid.querySelector(".add-button")?.focus();
}

document.getElementById("new-transaction").addEventListener("click", () => {
  if (cart.size > 0 && !completedTransaction) {
    openModal(resetModal);
    return;
  }
  resetTransaction();
});

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
  if (completedTransaction) return;
  paymentConfirmation.hidden = true;
  ["confirmed-total", "confirmed-paid", "confirmed-change"].forEach(id => {
    document.getElementById(id).textContent = "";
  });
  paymentMessage.textContent = "";
  paymentMessage.className = "payment-message";
  paymentChange.textContent = formatCentavos(0);
  cashInput.setAttribute("aria-invalid", "false");
}

function showPaymentError(message, invalidCash = false) {
  paymentMessage.textContent = message;
  paymentMessage.className = "payment-message payment-error";
  cashInput.setAttribute("aria-invalid", String(invalidCash));
}

// Validate before confirming: order, numeric input, nonnegative cash, precision,
// and enough money. A completed payment generates one receipt.
function confirmPayment(event) {
  event.preventDefault();
  if (completedTransaction) return;
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
  const paidCentavos = parseCashCentavos(rawAmount);
  if (!Number.isSafeInteger(paidCentavos)) {
    showPaymentError("Cash amount is too large. Enter a smaller amount.", true);
    return;
  }
  const totalCentavos = getTotalCentavos();
  if (paidCentavos < totalCentavos) {
    showPaymentError(`Insufficient cash. The total is ${formatCentavos(totalCentavos)}.`, true);
    return;
  }
  const change = formatCentavos(paidCentavos - totalCentavos);
  paymentChange.textContent = change;
  document.getElementById("confirmed-total").textContent = formatCentavos(totalCentavos);
  document.getElementById("confirmed-paid").textContent = formatCentavos(paidCentavos);
  document.getElementById("confirmed-change").textContent = change;
  paymentConfirmation.hidden = false;
  paymentMessage.textContent = "Cash payment confirmed successfully.";
  paymentMessage.className = "payment-message payment-success";
  generateReceipt(totalCentavos, paidCentavos);
}

paymentForm.addEventListener("submit", confirmPayment);
cashInput.addEventListener("input", resetPayment);

// Adding an existing product increases its quantity instead of adding a row.
function addToCart(productId) {
  if (completedTransaction) return;
  if (!products[productId]) return;
  cart.set(productId, (cart.get(productId) || 0) + 1);
  renderCart();
}

// Quantities stay at one or above. Use Remove to delete the last unit.
function changeQuantity(productId, change) {
  if (completedTransaction) return;
  if (!cart.has(productId) || (change !== 1 && change !== -1)) return;
  cart.set(productId, Math.max(1, cart.get(productId) + change));
  renderCart();
}

function removeFromCart(productId) {
  if (completedTransaction) return;
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
  // Visual selection only: the reference's outline marks products in the cart.
  Array.from(productGrid.children).forEach(card => {
    card.className = cart.has(Number(card.dataset.productId))
      ? "product-card is-in-cart" : "product-card";
  });
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

    const row = document.createElement("tr");
    row.className = "cart-item";
    const name = document.createElement("th");
    name.setAttribute("scope", "row");
    name.textContent = product.name;
    const unitPrice = document.createElement("td");
    unitPrice.className = "unit-price";
    unitPrice.textContent = formatCentavos(Math.round(product.price * 100));
    const quantityCell = document.createElement("td");
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
    subtotal.textContent = formatCentavos(subtotalCentavos);
    subtotal.setAttribute("aria-label", `Item subtotal: ${subtotal.textContent}`);
    const subtotalCell = document.createElement("td");
    subtotalCell.append(subtotal);
    quantityCell.append(quantityControls);
    const remove = createCartButton("\u00d7", "remove", productId, `Remove ${product.name} from cart`);
    remove.title = `Remove ${product.name} from cart`;
    const actionCell = document.createElement("td");
    actionCell.append(remove);
    row.append(name, unitPrice, quantityCell, subtotalCell, actionCell);
    cartItems.append(row);
  });

  emptyOrder.hidden = cart.size > 0;
  cartItems.hidden = cart.size === 0;
  cartTableWrap.hidden = cart.size === 0;
  itemCount.textContent = `${totalQuantity} ${totalQuantity === 1 ? "item" : "items"}`;
  orderSubtotal.textContent = formatCentavos(totalCentavos);
  orderTotal.textContent = formatCentavos(totalCentavos);

  // Keep keyboard focus usable after rows are rebuilt or removed.
  if (focusedButton) {
    const replacement = cartItems.querySelector(`[data-product-id="${focusedId}"][data-action="${focusedAction}"]`);
    const fallback = cartItems.querySelector(`[data-product-id="${focusedId}"][data-action="increase"]`)
      || cartItems.querySelector("button:not(:disabled)")
      || productGrid.querySelector(".add-button");
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
