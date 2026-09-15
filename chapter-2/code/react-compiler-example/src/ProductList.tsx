import { ProductCard } from './ProductCard';

interface Product {
  id: number;
  name: string;
}

interface Props {
  products: Product[];
  onAdd: (id: number) => void;
}

// From the book, section "The React Compiler: Automatic Optimization"
//
// Before React Compiler this needed useMemo(() => ..., [products]) around
// `sorted` and useCallback(..., [onAdd]) around `handleAdd` to stop
// <ProductCard> re-rendering on every keystroke elsewhere in the tree.
//
// After React Compiler: write plain React, the compiler memoizes for you.
// No useMemo, useCallback, or React.memo needed — the compiler handles it.
export function ProductList({ products, onAdd }: Props) {
  const sorted = [...products].sort((a, b) => a.name.localeCompare(b.name));
  return (
    <ul>
      {sorted.map((p) => (
        <ProductCard key={p.id} product={p} onAdd={onAdd} />
      ))}
    </ul>
  );
}
