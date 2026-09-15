"use client";

import { useTransition } from "react";
import { addToCart } from "@/app/actions"; // Server Action

// From the book, section "Core Architecture: JSX and Functional Components"
// Client Component — ships to browser
export function AddToCartButton({ productId }: { productId: number }) {
  const [isPending, startTransition] = useTransition();
  return (
    <button
      disabled={isPending}
      onClick={() => startTransition(() => addToCart(productId))}
    >
      {isPending ? "Adding..." : "Add to Cart"}
    </button>
  );
}
