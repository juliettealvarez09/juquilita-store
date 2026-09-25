-- JUQUILITA V1 — Seed data

-- Admin user (password: admin123)
-- bcrypt hash for 'admin123'
INSERT INTO users (name, email, password) VALUES
('Administrador', 'admin@juquilita.com', '$2b$10$JRcn9X3AiCg33vhVHu4oy.TENgdBkWLpWNRPgxJFxQVd1O217e4fi');

-- Categories
INSERT INTO categories (name) VALUES
('Herramientas'),
('Plomería'),
('Electricidad'),
('Pintura'),
('Construcción'),
('Tornillería'),
('Cerrajería'),
('Jardinería');

-- Products
INSERT INTO products (name, brand, description, price, cost, stock, minimum_stock, unit, category_id, image_url) VALUES
('Martillo uña 16 oz', 'Truper', 'Martillo de uña con mango de fibra de vidrio, ideal para trabajo general', 189.00, 120.00, 25, 5, 'pieza', 1, 'https://placehold.co/400x400/f5f0eb/1a1a1a?text=Martillo'),
('Desarmador Phillips #2', 'Truper', 'Desarmador de cruz punta Phillips número 2, mango ergonómico', 65.00, 38.00, 40, 10, 'pieza', 1, 'https://placehold.co/400x400/f5f0eb/1a1a1a?text=Desarmador'),
('Pinzas de electricista 8"', 'Truper', 'Pinzas de electricista profesionales con aislamiento de 1000V', 145.00, 90.00, 18, 5, 'pieza', 1, 'https://placehold.co/400x400/f5f0eb/1a1a1a?text=Pinzas'),
('Cinta teflón 3/4"', 'Marca Genérica', 'Cinta de teflón para sellado de roscas en conexiones de agua y gas', 12.00, 6.00, 100, 20, 'pieza', 2, 'https://placehold.co/400x400/f5f0eb/1a1a1a?text=Teflón'),
('Tubo PVC 1/2" x 3m', 'Amanco', 'Tubo de PVC hidráulico de media pulgada, longitud 3 metros', 38.00, 22.00, 50, 10, 'pieza', 2, 'https://placehold.co/400x400/f5f0eb/1a1a1a?text=Tubo+PVC'),
('Codo PVC 1/2"', 'Amanco', 'Codo de PVC hidráulico de 90 grados, media pulgada', 8.00, 4.00, 80, 15, 'pieza', 2, 'https://placehold.co/400x400/f5f0eb/1a1a1a?text=Codo+PVC'),
('Silicón transparente 280ml', 'Henkel', 'Sellador de silicón transparente multiusos', 89.00, 55.00, 22, 5, 'pieza', 2, 'https://placehold.co/400x400/f5f0eb/1a1a1a?text=Silicón'),
('Pegamento PVC 250ml', 'Marca Genérica', 'Pegamento para tubería y conexiones de PVC', 75.00, 45.00, 15, 5, 'bote', 2, 'https://placehold.co/400x400/f5f0eb/1a1a1a?text=Pegamento'),
('Cinta aislante negra', 'Truper', 'Cinta aislante de vinil, color negro, 18m', 18.00, 9.00, 60, 15, 'pieza', 3, 'https://placehold.co/400x400/f5f0eb/1a1a1a?text=Cinta+Aislante'),
('Foco LED 9W luz cálida', 'Philips', 'Foco LED ahorrador, equivalente a 60W incandescente, base E27', 45.00, 28.00, 35, 10, 'pieza', 3, 'https://placehold.co/400x400/f5f0eb/1a1a1a?text=Foco+LED'),
('Contacto eléctrico duplex', 'Bticino', 'Contacto duplex polarizado para instalación empotrada', 35.00, 18.00, 30, 10, 'pieza', 3, 'https://placehold.co/400x400/f5f0eb/1a1a1a?text=Contacto'),
('Brocha 2"', 'Marca Genérica', 'Brocha de cerda natural de 2 pulgadas para pintura', 85.00, 50.00, 20, 5, 'pieza', 4, 'https://placehold.co/400x400/f5f0eb/1a1a1a?text=Brocha'),
('Rodillo 9"', 'Marca Genérica', 'Rodillo con felpa de 9 pulgadas, incluye marco', 120.00, 70.00, 15, 5, 'pieza', 4, 'https://placehold.co/400x400/f5f0eb/1a1a1a?text=Rodillo'),
('Thinner estándar 1L', 'Comex', 'Solvente thinner estándar para dilución de pintura y limpieza', 65.00, 40.00, 28, 8, 'litro', 4, 'https://placehold.co/400x400/f5f0eb/1a1a1a?text=Thinner'),
('Cemento gris 50 kg', 'Cruz Azul', 'Saco de cemento Portland gris de 50 kilogramos', 245.00, 190.00, 40, 10, 'bulto', 5, 'https://placehold.co/400x400/f5f0eb/1a1a1a?text=Cemento'),
('Clavo 2" (kg)', 'Marca Genérica', 'Clavos de acero de 2 pulgadas, venta por kilogramo', 45.00, 28.00, 30, 8, 'kg', 5, 'https://placehold.co/400x400/f5f0eb/1a1a1a?text=Clavos'),
('Tornillo 1/4" x 1" (10 pzas)', 'Holo-Krome', 'Tornillos cabeza hexagonal de 1/4 por 1 pulgada, paquete de 10', 22.00, 12.00, 50, 15, 'paquete', 6, 'https://placehold.co/400x400/f5f0eb/1a1a1a?text=Tornillos'),
('Taquete plástico 1/4" (20 pzas)', 'Fischer', 'Taquetes de plástico de expansión, paquete de 20', 15.00, 7.00, 60, 15, 'paquete', 6, 'https://placehold.co/400x400/f5f0eb/1a1a1a?text=Taquetes'),
('Candado 40mm', 'Phillips', 'Candado de latón con llave, arco endurecido de 40mm', 135.00, 80.00, 12, 3, 'pieza', 7, 'https://placehold.co/400x400/f5f0eb/1a1a1a?text=Candado'),
('Manguera 1/2" x 15m', 'Truper', 'Manguera flexible para jardín de media pulgada, 15 metros', 220.00, 140.00, 10, 3, 'pieza', 8, 'https://placehold.co/400x400/f5f0eb/1a1a1a?text=Manguera');
