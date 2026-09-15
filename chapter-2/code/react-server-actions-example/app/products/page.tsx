// From the book, section "Core Architecture: JSX and Functional Components"
// No "use client" directive = Server Component by default in Next.js
import { db } from "@/lib/db";
import { AddToCartButton } from "./AddToCartButton"; // client component

export default async function ProductsPage() {
  // Direct DB access — this code never ships to the browser
  const products = await db.product.findMany({ orderBy: { name: "asc" } });
  return (
    <ul>
      {products.map((p) => (
        <li key={p.id}>
          <span>
            {p.name} — ${p.price}
          </span>
          <AddToCartButton productId={p.id} /> {/* interactive island */}
        </li>
      ))}
    </ul>
  );
}
