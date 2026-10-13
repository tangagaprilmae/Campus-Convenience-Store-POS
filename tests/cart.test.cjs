const { test } = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const vm = require("node:vm");

// Minimal DOM substitute to exercise the application's actual click handlers.
class Element {
  constructor(tag = "div") { this.tag = tag; this.children = []; this.dataset = {}; this.listeners = {}; }
  append(...children) { children.forEach(child => { child.parent = this; }); this.children.push(...children); }
  replaceChildren(...children) { this.children = []; this.append(...children); }
  setAttribute() {}
  addEventListener(name, callback) { this.listeners[name] = callback; }
  contains(element) { return element === this || this.children.some(child => child.contains(element)); }
  closest() { return this.tag === "button" ? this : this.parent?.closest(); }
  querySelectorAll() { return this.children.flatMap(child => [...(child.tag === "button" ? [child] : []), ...child.querySelectorAll()]); }
  querySelector() { return this.querySelectorAll()[0] || null; }
  focus() {}
}

function setup() {
  const ids = ["product-grid", "cart-items", "empty-order", "item-count", "order-subtotal", "order-total", "payment-form", "cash-amount", "payment-message", "payment-change", "payment-confirmation", "confirmed-total", "confirmed-paid", "confirmed-change", "receipt", "receipt-items", "receipt-reference", "receipt-date", "receipt-total", "receipt-cash", "receipt-change", "new-transaction"];
  const nodes = Object.fromEntries(ids.map(id => [id, new Element()]));
  nodes["cash-amount"].value = "";
  nodes["cash-amount"].validity = { badInput: false };
  nodes["receipt"].hidden = true;
  nodes["payment-form"].append(new Element("button"));
  const document = { activeElement: null, getElementById: id => nodes[id], createElement: tag => new Element(tag) };
  vm.runInNewContext(fs.readFileSync(path.join(__dirname, "../script.js"), "utf8"), { document, Intl });
  const add = id => nodes["product-grid"].children[id].children[3].listeners.click();
  const rows = () => nodes["cart-items"].children;
  const press = (index, action) => {
    const row = rows()[index];
    const button = action === "remove" ? row.children[3] : row.children[2].children[0].children[action === "decrease" ? 0 : 2];
    nodes["cart-items"].listeners.click({ target: button });
  };
  const pay = (amount, badInput = false) => {
    nodes["cash-amount"].value = amount;
    nodes["cash-amount"].validity.badInput = badInput;
    nodes["payment-form"].listeners.submit({ preventDefault() {} });
  };
  const reset = () => nodes["new-transaction"].listeners.click();
  return { nodes, add, rows, press, pay, reset };
}

test("adding merges duplicates and displays item details and totals", () => {
  const { nodes, add, rows } = setup();
  assert.equal(nodes["empty-order"].hidden, false);
  add(0); add(0); add(1);
  assert.equal(rows().length, 2);
  assert.equal(rows()[0].children[0].textContent, "Instant Noodles");
  assert.equal(rows()[0].children[1].textContent, "₱18.00 each");
  assert.equal(rows()[0].children[2].children[0].children[1].textContent, 2);
  assert.equal(rows()[0].children[2].children[1].textContent, "₱36.00");
  assert.equal(nodes["order-total"].textContent, "₱61.00");
  assert.equal(nodes["order-subtotal"].textContent, "₱61.00");
  assert.equal(nodes["item-count"].textContent, "3 items");
  assert.equal(nodes["empty-order"].hidden, true);
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
  add(3);
  assert.equal(rows().length, 1);
  assert.equal(nodes["order-total"].textContent, "₱20.00");
});
