import { Link } from 'react-router-dom';

function getAvailability(stock, minimumStock) {
  if (stock === 0) return { text: 'Agotado', className: 'badge-out' };
  if (stock <= minimumStock) return { text: 'Quedan pocos', className: 'badge-low' };
  return { text: 'Disponible', className: 'badge-available' };
}

export default function ProductCard({ product, onAdd }) {
  const avail = getAvailability(product.stock, product.minimum_stock);

  return (
    <div className="product-card">
      <Link to={`/producto/${product.id}`}>
        <img src={product.image_url || 'https://placehold.co/400x400/f5f0eb/1a1a1a?text=Producto'} alt={product.name} className="product-card-img" />
      </Link>
      <div className="product-card-body">
        <Link to={`/producto/${product.id}`}>
          <div className="product-card-name">{product.name}</div>
          <div className="product-card-brand">{product.brand}</div>
        </Link>
        <div>
          <span className="product-card-price">${Number(product.price).toFixed(2)}</span>
          <span className="product-card-unit">por {product.unit}</span>
        </div>
        <div className="product-card-footer">
          <span className={`badge ${avail.className}`}>{avail.text}</span>
          {product.stock > 0 && (
            <button className="btn btn-primary btn-sm" onClick={() => onAdd(product)}>
              Agregar
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
