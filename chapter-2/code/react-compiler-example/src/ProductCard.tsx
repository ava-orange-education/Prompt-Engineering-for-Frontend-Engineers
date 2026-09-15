interface Product {
  id: number;
  name: string;
}

export function ProductCard({
  product,
  onAdd,
}: {
  product: Product;
  onAdd: (id: number) => void;
}) {
  return (
    <li>
      {product.name}
      <button onClick={() => onAdd(product.id)}>Add</button>
    </li>
  );
}
