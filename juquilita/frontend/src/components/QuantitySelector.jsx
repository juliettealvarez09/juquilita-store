export default function QuantitySelector({ value, onChange, max }) {
  return (
    <div className="qty-selector">
      <button onClick={() => onChange(Math.max(1, value - 1))}>−</button>
      <span>{value}</span>
      <button onClick={() => onChange(max ? Math.min(max, value + 1) : value + 1)}>+</button>
    </div>
  );
}
