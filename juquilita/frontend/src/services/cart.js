const CART_KEY = 'juquilita_cart';

function getCart() {
  try {
    return JSON.parse(localStorage.getItem(CART_KEY)) || [];
  } catch {
    return [];
  }
}

function saveCart(cart) {
  localStorage.setItem(CART_KEY, JSON.stringify(cart));
}

export function getItems() {
  return getCart();
}

export function addItem(product, quantity = 1) {
  const cart = getCart();
  const existing = cart.find(item => item.product_id === product.id);
  if (existing) {
    existing.quantity += quantity;
  } else {
    cart.push({
      product_id: product.id,
      name: product.name,
      brand: product.brand,
      price: parseFloat(product.price),
      unit: product.unit,
      stock: product.stock,
      image_url: product.image_url,
      quantity,
    });
  }
  saveCart(cart);
  return cart;
}

export function updateQuantity(productId, quantity) {
  const cart = getCart();
  const item = cart.find(i => i.product_id === productId);
  if (item) {
    item.quantity = Math.max(1, quantity);
  }
  saveCart(cart);
  return cart;
}

export function removeItem(productId) {
  const cart = getCart().filter(i => i.product_id !== productId);
  saveCart(cart);
  return cart;
}

export function clearCart() {
  localStorage.removeItem(CART_KEY);
}

export function getTotal() {
  return getCart().reduce((sum, item) => sum + item.price * item.quantity, 0);
}

export function getCount() {
  return getCart().reduce((sum, item) => sum + item.quantity, 0);
}
