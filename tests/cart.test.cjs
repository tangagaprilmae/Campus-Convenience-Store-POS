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
}

function setup() {
  const ids = ["product-grid", "cart-items", "empty-order", "item-count", "order-subtotal", "order-total"];
  const nodes = Object.fromEntries(ids.map(id => [id, new Element()]));
  const document = { activeElement: null, getElementById: id => nodes[id], createElement: tag => new Element(tag) };
  vm.runInNewContext(fs.readFileSync(path.join(__dirname, "../script.js"), "utf8"), { document, Intl });
  const add = id => nodes["product-grid"].children[id].children[3].listeners.click();
  const rows = () => nodes["cart-items"].children;
  const press = (index, action) => {
    const row = rows()[index];
    const button = action === "remove" ? row.children[3] : row.children[2].children[0].children[action === "decrease" ? 0 : 2];
    nodes["cart-items"].listeners.click({ target: button });
  };
  return { nodes, add, rows, press };
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
