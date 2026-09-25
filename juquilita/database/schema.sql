-- JUQUILITA V1 — Schema

CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  email VARCHAR(150) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE categories (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100) UNIQUE NOT NULL,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE products (
  id SERIAL PRIMARY KEY,
  name VARCHAR(200) NOT NULL,
  brand VARCHAR(100),
  description TEXT,
  price NUMERIC(10,2) NOT NULL CHECK (price >= 0),
  cost NUMERIC(10,2) CHECK (cost >= 0),
  stock INTEGER NOT NULL DEFAULT 0 CHECK (stock >= 0),
  minimum_stock INTEGER NOT NULL DEFAULT 5,
  unit VARCHAR(50) DEFAULT 'pieza',
  image_url TEXT,
  category_id INTEGER REFERENCES categories(id),
  active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE orders (
  id SERIAL PRIMARY KEY,
  folio VARCHAR(20) UNIQUE NOT NULL,
  customer_name VARCHAR(150) NOT NULL,
  customer_phone VARCHAR(20) NOT NULL,
  delivery_type VARCHAR(20) NOT NULL CHECK (delivery_type IN ('pickup', 'delivery')),
  address TEXT,
  "references" TEXT,
  payment_method VARCHAR(30) NOT NULL CHECK (payment_method IN ('pay_on_pickup', 'pay_on_delivery')),
  status VARCHAR(20) NOT NULL DEFAULT 'RECEIVED' CHECK (status IN ('RECEIVED','PREPARING','READY','COMPLETED','CANCELLED')),
  total NUMERIC(12,2) NOT NULL CHECK (total >= 0),
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE order_items (
  id SERIAL PRIMARY KEY,
  order_id INTEGER NOT NULL REFERENCES orders(id),
  product_id INTEGER NOT NULL REFERENCES products(id),
  product_name VARCHAR(200) NOT NULL,
  quantity INTEGER NOT NULL CHECK (quantity > 0),
  unit_price NUMERIC(10,2) NOT NULL,
  subtotal NUMERIC(12,2) NOT NULL
);

CREATE TABLE inventory_movements (
  id SERIAL PRIMARY KEY,
  product_id INTEGER NOT NULL REFERENCES products(id),
  order_id INTEGER REFERENCES orders(id),
  type VARCHAR(20) NOT NULL CHECK (type IN ('ENTRY','EXIT','ORDER','CANCELLATION','ADJUSTMENT')),
  quantity INTEGER NOT NULL,
  previous_stock INTEGER NOT NULL,
  new_stock INTEGER NOT NULL,
  notes TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_products_category ON products(category_id);
CREATE INDEX idx_products_active ON products(active);
CREATE INDEX idx_orders_status ON orders(status);
CREATE INDEX idx_orders_folio ON orders(folio);
CREATE INDEX idx_order_items_order ON order_items(order_id);
CREATE INDEX idx_inventory_product ON inventory_movements(product_id);
