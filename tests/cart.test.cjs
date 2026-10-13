const { test } = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const vm = require("node:vm");

// Minimal DOM substitute to exercise the application's actual click handlers.
class Element {
  constructor(tag = "div") { this.tag = tag; this.children = []; this.dataset = {}; this.listeners = {}; this.attributes = {}; }
  append(...children) { children.forEach(child => { child.parent = this; }); this.children.push(...children); }
  replaceChildren(...children) { this.children = []; this.append(...children); }
  setAttribute(name, value) { this.attributes[name] = String(value); }
  getAttribute(name) { return this.attributes[name] ?? null; }
  addEventListener(name, callback) { this.listeners[name] = callback; }
  contains(element) { return element === this || this.children.some(child => child.contains(element)); }
  closest() { return this.tag === "button" ? this : this.parent?.closest(); }
  matches(selector) {
    if (this.tag !== "button") return false;
    if (selector.includes(":not(:disabled)") && this.disabled) return false;
    if (selector.includes('[type="submit"]') && this.type !== "submit") return false;
    for (const match of selector.matchAll(/\[data-([\w-]+)="([^"]+)"\]/g)) {
      const key = match[1].replace(/-([a-z])/g, (_, letter) => letter.toUpperCase());
      if (String(this.dataset[key]) !== match[2]) return false;
    }
    return true;
  }
  querySelectorAll(selector = "button") { return this.children.flatMap(child => [...(child.matches(selector) ? [child] : []), ...child.querySelectorAll(selector)]); }
  querySelector(selector = "button") { return this.querySelectorAll(selector)[0] || null; }
  focus() { if (!this.disabled) this.ownerDocument.activeElement = this; }
}

function setup() {
  // Read real markup IDs so a missing or renamed page element fails the suite.
  const html = fs.readFileSync(path.join(__dirname, "../index.html"), "utf8");
  const entries = [...html.matchAll(/<([a-z]+)\b[^>]*\bid="([^"]+)"/g)];
  const nodes = Object.fromEntries(entries.map(match => [match[2], new Element(match[1])]));
  assert.equal(Object.keys(nodes).length, entries.length, "HTML IDs must be unique");
  nodes["cash-amount"].value = "";
  nodes["cash-amount"].validity = { badInput: false };
  nodes["receipt"].hidden = true;
  const document = { activeElement: null, getElementById: id => nodes[id] ?? null, createElement: tag => {
    const element = new Element(tag);
    element.ownerDocument = document;
    return element;
  } };
  Object.values(nodes).forEach(node => { node.ownerDocument = document; });
  const submit = document.createElement("button");
  submit.type = "submit";
  nodes["payment-form"].append(submit);
  vm.runInNewContext(fs.readFileSync(path.join(__dirname, "../script.js"), "utf8"), { document, Intl });
  const add = id => nodes["product-grid"].children[id].children[3].listeners.click();
  const rows = () => nodes["cart-items"].children;
  const press = (index, action) => {
    const row = rows()[index];
    const button = action === "remove" ? row.children[4].children[0] : row.children[2].children[0].children[action === "decrease" ? 0 : 2];
    nodes["cart-items"].listeners.click({ target: button });
  };
  const pay = (amount, badInput = false) => {
    nodes["cash-amount"].value = amount;
    nodes["cash-amount"].validity.badInput = badInput;
    nodes["payment-form"].listeners.submit({ preventDefault() {} });
  };
  const reset = () => nodes["new-transaction"].listeners.click();
  return { nodes, add, rows, press, pay, reset, document };
}

test("adding merges duplicates and displays item details and totals", () => {
  const { nodes, add, rows } = setup();
  assert.equal(nodes["empty-order"].hidden, false);
  add(0); add(0); add(1);
  assert.equal(rows().length, 2);
  assert.equal(rows()[0].children[0].textContent, "Instant Noodles");
  assert.equal(rows()[0].tag, "tr");
  assert.equal(rows()[0].children[0].tag, "th");
  assert.equal(rows()[0].children[1].textContent, "₱18.00");
  assert.equal(rows()[0].children[2].children[0].children[1].textContent, 2);
  assert.equal(rows()[0].children[3].children[0].textContent, "₱36.00");
  assert.equal(nodes["cart-table-wrap"].hidden, false);
  assert.equal(nodes["order-total"].textContent, "₱61.00");
  assert.equal(nodes["order-subtotal"].textContent, "₱61.00");
  assert.equal(nodes["item-count"].textContent, "3 items");
  assert.equal(nodes["empty-order"].hidden, true);
});

test("all six catalog names, peso prices, and add controls are correct", () => {
  const { nodes } = setup();
  const expected = [
    ["Instant Noodles", "₱18.00"], ["Potato Chips", "₱25.00"],
    ["Soft Drink (Can)", "₱25.00"], ["Bottled Water", "₱20.00"],
    ["Ballpen (piece)", "₱12.00"], ["Notebook (piece)", "₱35.00"]
  ];
  const cards = nodes["product-grid"].children;
  assert.equal(cards.length, expected.length);
  cards.forEach((card, index) => {
    assert.equal(card.children[1].textContent, expected[index][0]);
    assert.equal(card.children[2].textContent, expected[index][1]);
    assert.match(card.children[3].innerHTML, /Add to Cart/);
    assert.equal(typeof card.children[3].listeners.click, "function");
  });
});

test("large valid decimal cash preserves every centavo in confirmation and receipt", () => {
  const { nodes, add, pay } = setup();
  add(0);
  pay("45035996273704.02");
  assert.equal(nodes["confirmed-paid"].textContent, "₱45,035,996,273,704.02");
  assert.equal(nodes["receipt-cash"].textContent, "₱45,035,996,273,704.02");
  assert.equal(nodes["confirmed-change"].textContent, "₱45,035,996,273,686.02");
  assert.equal(nodes["receipt-change"].textContent, "₱45,035,996,273,686.02");
});

test("quantity updates and removal preserve usable keyboard focus", () => {
  const { add, rows, press, document, nodes } = setup();
  add(0); add(1);
  rows()[1].children[2].children[0].children[2].focus();
  press(1, "increase");
  assert.equal(document.activeElement.dataset.productId, 1);
  assert.equal(document.activeElement.dataset.action, "increase");
  rows()[1].children[2].children[0].children[0].focus();
  press(1, "decrease");
  assert.equal(document.activeElement.dataset.action, "increase");
  assert.equal(document.activeElement.disabled, undefined);
  rows()[1].children[4].children[0].focus();
  press(1, "remove");
  assert.equal(document.activeElement.dataset.productId, 0);
  rows()[0].children[4].children[0].focus();
  press(0, "remove");
  assert.equal(document.activeElement, nodes["product-grid"].children[0].children[3]);
});

test("input edits, cart edits, and new transaction clear validation state", () => {
  const { nodes, add, pay, reset } = setup();
  add(0); pay("-1");
  assert.equal(nodes["cash-amount"].getAttribute("aria-invalid"), "true");
  nodes["cash-amount"].listeners.input();
  assert.equal(nodes["payment-message"].textContent, "");
  assert.equal(nodes["cash-amount"].getAttribute("aria-invalid"), "false");
  pay("0"); add(1);
  assert.equal(nodes["payment-message"].textContent, "");
  pay("0"); reset();
  assert.equal(nodes["payment-message"].textContent, "");
  assert.equal(nodes["cash-amount"].getAttribute("aria-invalid"), "false");
  assert.equal(nodes["cash-amount"].value, "");
});

test("payment rejects an empty cart and invalid or insufficient cash", () => {
  const { nodes, add, pay } = setup();
  pay("100");
  assert.match(nodes["payment-message"].textContent, /cart is empty/);
  add(0);
  for (const [amount, message, badInput] of [
    ["", /Enter the cash amount/], ["   ", /Enter the cash amount/],
    ["abc", /valid numeric/], ["", /valid numeric/, true],
    ["-1", /cannot be negative/], ["Infinity", /valid numeric/],
    ["0", /Insufficient cash/], ["17.99", /Insufficient cash/],
    ["18.001", /two decimal places/], ["99999999999999999", /too large/]
  ]) {
    pay(amount, badInput);
    assert.match(nodes["payment-message"].textContent, message);
    assert.equal(nodes["payment-confirmation"].hidden, true);
    assert.equal(nodes["payment-change"].textContent, "₱0.00");
    assert.equal(nodes["receipt"].hidden, true);
  }
});

test("cash confirmation displays total, paid amount, and exact change", () => {
  const { nodes, add, pay, rows, reset } = setup();
  add(0); add(1);
  pay("43");
  assert.equal(nodes["confirmed-total"].textContent, "₱43.00");
  assert.equal(nodes["confirmed-paid"].textContent, "₱43.00");
  assert.equal(nodes["confirmed-change"].textContent, "₱0.00");
  reset(); add(0); add(1);
  pay("50.10");
  assert.equal(nodes["confirmed-paid"].textContent, "₱50.10");
  assert.equal(nodes["confirmed-change"].textContent, "₱7.10");
  assert.equal(nodes["payment-change"].textContent, "₱7.10");
  assert.equal(nodes["payment-confirmation"].hidden, false);
  assert.match(nodes["payment-message"].textContent, /confirmed successfully/);
  assert.equal(rows().length, 2);
  reset();
  assert.equal(nodes["payment-confirmation"].hidden, true);
  add(0); add(1); add(3);
  assert.equal(nodes["payment-confirmation"].hidden, true);
  pay("50");
  assert.match(nodes["payment-message"].textContent, /Insufficient cash/);
});

test("receipt captures purchased items and blocks duplicate confirmation and edits", () => {
  const { nodes, add, pay, rows, press } = setup();
  add(0); add(0); add(5); pay("100");
  const receiptRows = nodes["receipt-items"].children;
  assert.equal(receiptRows.length, 2);
  assert.deepEqual(receiptRows[0].children.map(cell => cell.textContent), ["Instant Noodles", 2, "₱18.00", "₱36.00"]);
  assert.deepEqual(receiptRows[1].children.map(cell => cell.textContent), ["Notebook (piece)", 1, "₱35.00", "₱35.00"]);
  assert.equal(nodes["receipt-total"].textContent, "₱71.00");
  assert.equal(nodes["receipt-cash"].textContent, "₱100.00");
  assert.equal(nodes["receipt-change"].textContent, "₱29.00");
  assert.match(nodes["receipt-reference"].textContent, /^CCS-\d+-0001$/);
  assert.match(nodes["receipt-date"].textContent, /Asia\/Manila/);
  assert.equal(nodes["receipt"].hidden, false);
  const reference = nodes["receipt-reference"].textContent;
  pay("200"); add(3); press(0, "increase"); press(0, "remove");
  assert.equal(nodes["receipt-reference"].textContent, reference);
  assert.equal(nodes["receipt-cash"].textContent, "₱100.00");
  assert.equal(rows().length, 2);
  assert.equal(nodes["order-total"].textContent, "₱71.00");
  assert.equal(nodes["cash-amount"].disabled, true);
  assert.equal(nodes["payment-form"].querySelector().disabled, true);
});

test("new transaction clears all customer data and supports a second purchase", () => {
  const { nodes, add, pay, rows, reset } = setup();
  add(0); pay("50");
  const firstReference = nodes["receipt-reference"].textContent;
  reset();
  assert.equal(rows().length, 0);
  assert.equal(nodes["cash-amount"].value, "");
  assert.equal(nodes["payment-message"].textContent, "");
  assert.equal(nodes["payment-confirmation"].hidden, true);
  assert.equal(nodes["receipt"].hidden, true);
  assert.equal(nodes["receipt-items"].children.length, 0);
  for (const id of ["receipt-reference", "receipt-date", "receipt-total", "receipt-cash", "receipt-change", "confirmed-total", "confirmed-paid", "confirmed-change"]) {
    assert.equal(nodes[id].textContent, "");
  }
  assert.equal(nodes["order-total"].textContent, "₱0.00");
  assert.equal(nodes["payment-change"].textContent, "₱0.00");
  assert.equal(nodes["item-count"].textContent, "0 items");
  assert.equal(nodes["empty-order"].hidden, false);
  assert.equal(nodes["cash-amount"].disabled, false);
  assert.equal(nodes["payment-form"].querySelector().disabled, false);
  pay("100");
  assert.match(nodes["payment-message"].textContent, /cart is empty/);
  reset();
  assert.equal(nodes["payment-message"].textContent, "");
  add(4); pay("20");
  assert.equal(nodes["receipt-total"].textContent, "₱12.00");
  assert.equal(nodes["receipt-change"].textContent, "₱8.00");
  assert.notEqual(nodes["receipt-reference"].textContent, firstReference);
  assert.match(nodes["receipt-reference"].textContent, /-0002$/);
  assert.equal(nodes["receipt-items"].children.length, 1);
});

test("plus and minus update totals and prevent quantities below one", () => {
  const { nodes, add, rows, press } = setup();
  add(5); press(0, "increase");
  assert.equal(nodes["order-total"].textContent, "₱70.00");
  press(0, "decrease");
  assert.equal(nodes["order-total"].textContent, "₱35.00");
  press(0, "decrease"); press(0, "decrease");
  assert.equal(rows()[0].children[2].children[0].children[1].textContent, 1);
  assert.equal(rows()[0].children[2].children[0].children[0].disabled, true);
  assert.equal(nodes["item-count"].textContent, "1 item");
});

test("removing updates totals and restores the empty-cart message", () => {
  const { nodes, add, rows, press } = setup();
  add(2); add(3); press(0, "increase"); press(0, "remove");
  assert.equal(rows().length, 1);
  assert.equal(nodes["order-total"].textContent, "₱20.00");
  press(0, "remove");
  assert.equal(rows().length, 0);
  assert.equal(nodes["order-total"].textContent, "₱0.00");
  assert.equal(nodes["order-subtotal"].textContent, "₱0.00");
  assert.equal(nodes["item-count"].textContent, "0 items");
  assert.equal(nodes["empty-order"].hidden, false);
  assert.equal(nodes["cart-items"].hidden, true);
  assert.equal(nodes["cart-table-wrap"].hidden, true);
  add(3);
  assert.equal(rows().length, 1);
  assert.equal(nodes["order-total"].textContent, "₱20.00");
});

test("all six products work in the order table through payment and reset", () => {
  const { nodes, add, rows, press, pay, reset } = setup();
  for (let id = 0; id < 6; id += 1) add(id);
  assert.equal(rows().length, 6);
  assert.equal(nodes["order-total"].textContent, "₱135.00");
  press(0, "increase");
  assert.equal(rows().length, 6);
  assert.equal(nodes["order-total"].textContent, "₱153.00");
  press(0, "decrease");
  press(5, "remove");
  assert.equal(rows().length, 5);
  assert.equal(nodes["order-total"].textContent, "₱100.00");
  pay("150");
  assert.equal(nodes["receipt-total"].textContent, "₱100.00");
  assert.equal(nodes["receipt-change"].textContent, "₱50.00");
  nodes["cart-table-wrap"].scrollTop = 120;
  nodes["cart-table-wrap"].scrollLeft = 100;
  reset();
  assert.equal(rows().length, 0);
  assert.equal(nodes["cart-table-wrap"].hidden, true);
  assert.equal(nodes["cart-table-wrap"].scrollTop, 0);
  assert.equal(nodes["cart-table-wrap"].scrollLeft, 0);
});
