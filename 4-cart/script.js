const products = [
  { id: 1, name: "Кофе", price: 300 },
  { id: 2, name: "Чай", price: 200 },
  { id: 3, name: "Круассан", price: 150 },
  { id: 4, name: "Маффин", price: 180 },
];

let cart = [];
let discount = 0;

const productsEl = document.getElementById("products");
const cartItemsEl = document.getElementById("cart-items");
const badgeEl = document.getElementById("badge");
const totalEl = document.getElementById("total");
const emptyMsg = document.getElementById("empty-msg");
const promoInput = document.getElementById("promo-input");
const promoBtn = document.getElementById("promo-btn");
const clearBtn = document.getElementById("clear-btn");

function renderProducts() {
  products.forEach((p) => {
    const card = document.createElement("div");
    card.className = "product";
    const title = document.createElement("h3");
    title.textContent = p.name;
    const price = document.createElement("p");
    price.textContent = `${p.price} ₽`;
    card.append(title, price);
    const btn = document.createElement("button");
    btn.textContent = "В корзину";
    btn.addEventListener("click", (e) => addToCart(p.id));
    card.appendChild(btn);
    productsEl.appendChild(card);
  });
}

function addToCart(id) {
  const product = products.find((p) => p.id === id);
  if (!product) {
    return;
  }
  const existing = cart.find((el) => el.id === id);
  if (existing) existing.qty++;
  else
    cart.push({
      id: product.id,
      name: product.name,
      price: product.price,
      qty: 1,
    });
  renderCart();
}

function increaseQty(id) {
  const item = cart.find((i) => i.id === id);
  item.qty++;
  renderCart();
}

function decreaseQty(id) {
  const item = cart.find((i) => i.id === id);
  if (item.qty <= 1) return;
  item.qty--;
  renderCart();
}

function removeItem(id) {
  cart = cart.filter((i) => i.id !== id);
  renderCart();
}

function applyPromo() {
  if ((promoInput.value = "SALE10")) {
    discount = 0.1;
  }
  renderCart();
}

function clearCart() {
  cart.splice(0, 1);
  renderCart();
}

function createEl(tag, className, text) {
  const node = document.createElement(tag);
  if (className) node.className = className;
  node.textContent = text;
  return node;
}

function renderCart() {
  cartItemsEl.replaceChildren();
  let total = "";
  cart.forEach((item) => {
    const lineTotal = item.price;
    const li = document.createElement("li");
    li.className = "cart-item";
    const name = createEl("span", "", item.name);
    const dec = createEl("button", "qty-btn", "-");
    dec.dataset.act = "dec";
    const qty = createEl("span", "qty", item.qty);
    const inc = createEl("button", "qty-btn", "+");
    inc.dataset.act = "inc";
    const line = createEl("span", "line", `${lineTotal} ₽`);
    const remove = createEl("button", "remove", "✕");

    li.append(name, dec, qty, inc, line, remove);
    li.querySelector('[data-act="inc"]').addEventListener("click", () =>
      increaseQty(item.id),
    );
    li.querySelector('[data-act="dec"]').addEventListener("click", () =>
      decreaseQty(item.id),
    );
    li.querySelector(".remove").addEventListener("click", () =>
      removeItem(item.id),
    );
    cartItemsEl.appendChild(li);
    total += item.price * item.qty;
  });

  if (discount) {
    total = total - total * discount;
  }

  badgeEl.textContent = cart.length;
  totalEl.textContent = total;
  emptyMsg.hidden = true;
}

promoBtn.addEventListener("click", applyPromo);
clearBtn.addEventListener("click", clearCart);

renderProducts();
renderCart();
